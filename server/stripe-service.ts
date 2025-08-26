import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export class StripeService {
  /**
   * Charge a prorated amount for adding a teen driver mid-cycle
   */
  static async chargeProratedAmount(
    customerId: string,
    amount: string,
    description: string
  ): Promise<{ success: boolean; chargeId?: string; error?: string }> {
    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      if (amountInCents <= 0) {
        return { success: true }; // No charge needed
      }

      const charge = await stripe.invoiceItems.create({
        customer: customerId,
        amount: amountInCents,
        currency: 'usd',
        description,
      });

      // Create and pay the invoice immediately
      const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: true, // Automatically finalize and pay
      });

      if (!invoice.id) {
        throw new Error('Failed to create invoice');
      }

      const paidInvoice = await stripe.invoices.pay(invoice.id);

      return { 
        success: true, 
        chargeId: paidInvoice.id 
      };
    } catch (error: any) {
      console.error('Stripe prorated charge error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Get customer payment methods to ensure we can charge them
   */
  static async getCustomerDefaultPaymentMethod(customerId: string): Promise<string | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      
      if (customer.deleted) {
        return null;
      }

      return (customer as Stripe.Customer).invoice_settings?.default_payment_method as string || null;
    } catch (error) {
      console.error('Error retrieving customer payment method:', error);
      return null;
    }
  }

  /**
   * Create a Stripe customer with payment method
   */
  static async createCustomer(
    email: string,
    name: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      // Create customer
      const customer = await stripe.customers.create({
        email,
        name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      return {
        success: true,
        customerId: customer.id,
      };
    } catch (error: any) {
      console.error('Stripe customer creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a Stripe subscription with trial period
   */
  static async createSubscription(
    customerId: string,
    priceId: string,
    trialPeriodDays: number = 7
  ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: trialPeriodDays,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscriptionId: subscription.id,
      };
    } catch (error: any) {
      console.error('Stripe subscription creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Cancel a Stripe subscription at period end
   */
  static async cancelSubscription(
    subscriptionId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Stripe subscription cancellation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Reactivate a cancelled subscription
   */
  static async reactivateSubscription(
    subscriptionId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Stripe subscription reactivation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get subscription details from Stripe
   */
  static async getSubscription(
    subscriptionId: string
  ): Promise<{ success: boolean; subscription?: Stripe.Subscription; error?: string }> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      return {
        success: true,
        subscription,
      };
    } catch (error: any) {
      console.error('Stripe subscription retrieval error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update subscription pricing (for billing period changes)
   */
  static async updateSubscriptionPricing(
    subscriptionId: string,
    newPriceId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentItem = subscription.items.data[0];
      
      // Update subscription with new price
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: currentItem.id,
          price: newPriceId,
        }],
        proration_behavior: 'always_invoice', // Pro-rate the change
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Stripe updateSubscriptionPricing error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update subscription pricing'
      };
    }
  }
}