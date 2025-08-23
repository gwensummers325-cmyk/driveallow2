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
}