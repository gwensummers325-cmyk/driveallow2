import Stripe from 'stripe';
import { storage } from './storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

export interface CreateCardRequest {
  teenId: string;
  parentId: string;
  cardType: 'virtual' | 'physical';
  spendingLimit: number; // in cents
}

export interface UpdateSpendingLimitsRequest {
  cardId: string;
  dailyLimit: number; // in cents
  monthlyLimit?: number; // in cents
  allowedCategories?: string[];
  blockedCategories?: string[];
}

export class StripeService {
  // Create Stripe customer for parent (legal guardian)
  async createCustomer(parentEmail: string, parentName: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email: parentEmail,
        name: parentName,
        metadata: {
          driveallow_parent: 'true',
        },
      });
      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create payment account');
    }
  }

  // Create cardholder for teen (linked to parent customer)
  async createCardholder(teenId: string, parentCustomerId: string, teenName: string): Promise<string> {
    try {
      const teen = await storage.getUser(teenId);
      if (!teen) throw new Error('Teen not found');

      const cardholder = await stripe.issuing.cardholders.create({
        type: 'individual',
        name: teenName,
        email: teen.email || undefined,
        metadata: {
          driveallow_teen_id: teenId,
          parent_customer_id: parentCustomerId,
        },
        billing: {
          address: {
            line1: '123 Main St', // You'd collect this from parent during setup
            city: 'Anytown',
            state: 'CA',
            postal_code: '90210',
            country: 'US',
          },
        },
      });
      return cardholder.id;
    } catch (error) {
      console.error('Error creating cardholder:', error);
      throw new Error('Failed to create cardholder account');
    }
  }

  // Create card for teen with initial spending controls
  async createCard(request: CreateCardRequest): Promise<{ cardId: string; last4?: string }> {
    try {
      const teen = await storage.getUser(request.teenId);
      if (!teen || !teen.stripeCardholderId) {
        throw new Error('Teen cardholder not found');
      }

      const card = await stripe.issuing.cards.create({
        cardholder: teen.stripeCardholderId,
        type: request.cardType,
        status: 'active',
        spending_controls: {
          spending_limits: [
            {
              amount: request.spendingLimit,
              interval: 'daily' as const,
            },
          ],
          blocked_categories: [
            'alcoholic_beverages_and_bars',
            'gambling', 
            'tobacco_products',
          ] as any,
        },
        metadata: {
          driveallow_teen_id: request.teenId,
          driveallow_parent_id: request.parentId,
        },
      });

      // Update user with card ID
      await storage.updateUserStripeInfo(request.teenId, {
        stripeCardId: card.id,
        cardStatus: 'active',
      });

      return {
        cardId: card.id,
        last4: card.last4,
      };
    } catch (error) {
      console.error('Error creating card:', error);
      throw new Error('Failed to create allowance card');
    }
  }

  // Update spending limits based on allowance balance and driving behavior
  async updateSpendingLimits(request: UpdateSpendingLimitsRequest): Promise<void> {
    try {
      await stripe.issuing.cards.update(request.cardId, {
        spending_controls: {
          spending_limits: [
            {
              amount: request.dailyLimit,
              interval: 'daily' as const,
            },
            ...(request.monthlyLimit ? [{
              amount: request.monthlyLimit,
              interval: 'monthly' as const,
            }] : []),
          ],
          allowed_categories: request.allowedCategories as any,
          blocked_categories: (request.blockedCategories || [
            'alcoholic_beverages_and_bars',
            'gambling',
            'tobacco_products',
          ]) as any,
        },
      });
    } catch (error) {
      console.error('Error updating spending limits:', error);
      throw new Error('Failed to update spending limits');
    }
  }

  // Suspend card (for violations or parent control)
  async suspendCard(cardId: string): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        status: 'inactive',
      });
    } catch (error) {
      console.error('Error suspending card:', error);
      throw new Error('Failed to suspend card');
    }
  }

  // Reactivate card
  async reactivateCard(cardId: string): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        status: 'active',
      });
    } catch (error) {
      console.error('Error reactivating card:', error);
      throw new Error('Failed to reactivate card');
    }
  }

  // Get card details
  async getCard(cardId: string): Promise<Stripe.Issuing.Card> {
    try {
      return await stripe.issuing.cards.retrieve(cardId);
    } catch (error) {
      console.error('Error retrieving card:', error);
      throw new Error('Failed to retrieve card details');
    }
  }

  // Get recent transactions for a card
  async getCardTransactions(cardId: string, limit = 10): Promise<Stripe.Issuing.Transaction[]> {
    try {
      const transactions = await stripe.issuing.transactions.list({
        card: cardId,
        limit,
      });
      return transactions.data;
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      throw new Error('Failed to retrieve transactions');
    }
  }

  // Handle real-time authorization (webhook)
  async authorizeTransaction(authorizationId: string, approved: boolean): Promise<void> {
    try {
      if (approved) {
        await stripe.issuing.authorizations.approve(authorizationId);
      } else {
        await stripe.issuing.authorizations.decline(authorizationId);
      }
    } catch (error) {
      console.error('Error processing authorization:', error);
      throw new Error('Failed to process transaction authorization');
    }
  }

  // Convert allowance balance to card spending limit
  convertBalanceToSpendingLimit(balanceInDollars: number): number {
    // Convert dollars to cents and ensure minimum/maximum limits
    const cents = Math.round(balanceInDollars * 100);
    const minLimit = 100; // $1.00 minimum
    const maxLimit = 50000; // $500.00 maximum daily
    
    return Math.max(minLimit, Math.min(maxLimit, cents));
  }

  // Update card limits based on current allowance balance
  async syncCardWithAllowance(teenId: string): Promise<void> {
    try {
      const teen = await storage.getUser(teenId);
      const balance = await storage.getAllowanceBalance(teenId);
      
      if (!teen?.stripeCardId || !balance) {
        return;
      }

      const dailyLimit = this.convertBalanceToSpendingLimit(parseFloat(balance.currentBalance));
      
      await this.updateSpendingLimits({
        cardId: teen.stripeCardId,
        dailyLimit,
      });
    } catch (error) {
      console.error('Error syncing card with allowance:', error);
    }
  }
}

export const stripeService = new StripeService();