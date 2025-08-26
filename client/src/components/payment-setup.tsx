import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, SmartphoneNfc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
  disableLink: true,
};

interface PaymentSetupProps {
  selectedPlan: 'safety_first' | 'safety_plus' | 'driveallow_pro' | 'driveallow_pro_yearly';
  billingPeriod?: 'monthly' | 'yearly';
  onPaymentSetup: (paymentMethodId: string) => void;
  isLoading: boolean;
}

export function PaymentSetup({ selectedPlan, billingPeriod = 'monthly', onPaymentSetup, isLoading }: PaymentSetupProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const planDetails = {
    safety_first: {
      name: 'Safety First',
      price: 19.99,
      period: 'month',
      features: [
        'Driving behavior monitoring',
        'Allowance management',
        'Incident reporting', 
        'Safety scoring',
        'Email notifications',
        'Up to 2 drivers included'
      ]
    },
    safety_plus: {
      name: 'Safety Plus',
      price: 29.99,
      period: 'month',
      features: [
        'All Safety First features',
        'Phone usage monitoring',
        'Up to 2 drivers included'
      ]
    },
    driveallow_pro: {
      name: 'DriveAllow Pro',
      price: 99,
      period: 'month',
      features: [
        'Unlimited teen drivers',
        'Real-time driving behavior monitoring',
        'Smart allowance management',
        'Phone usage during driving alerts',
        'All safety features included'
      ]
    },
    driveallow_pro_yearly: {
      name: 'DriveAllow Pro',
      price: 999,
      period: 'year',
      features: [
        'Unlimited teen drivers',
        'Real-time driving behavior monitoring',
        'Smart allowance management',
        'Phone usage during driving alerts',
        'All safety features included'
      ]
    }
  };

  const plan = planDetails[selectedPlan];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      onPaymentSetup(paymentMethod.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <p className="text-sm text-gray-600">
            Your card will not be charged during the 7-day trial period
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Your card information is securely processed by Stripe</p>
              <p>• No charges during your 7-day free trial</p>
              <p>• Cancel anytime before the trial ends</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!stripe || isProcessing || isLoading}
              data-testid="button-setup-payment"
            >
              {isProcessing ? "Setting up payment..." : "Start Free Trial"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}