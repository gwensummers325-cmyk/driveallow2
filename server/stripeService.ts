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

  // Create card for teen without spending limits
  async createCard(request: CreateCardRequest): Promise<{ cardId: string; last4?: string }> {
    try {
      const teen = await storage.getUser(request.teenId);
      if (!teen || !teen.stripeCardholderId) {
        throw new Error('Teen cardholder not found');
      }

      const card = await stripe.issuing.cards.create({
        cardholder: teen.stripeCardholderId,
        type: request.cardType,
        currency: 'usd',
        status: 'active',
        spending_controls: {
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

}

export const stripeService = new StripeService();