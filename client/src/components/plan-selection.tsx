import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, SmartphoneNfc, Star } from "lucide-react";

interface PlanSelectionProps {
  onContinue: () => void;
}

export function PlanSelection({ onContinue }: PlanSelectionProps) {
  const plan = {
    name: 'DriveAllow Pro',
    price: 99,
    description: 'Complete teen driving safety and allowance management',
    icon: Shield,
    features: [
      'Unlimited teen drivers',
      'Real-time driving behavior monitoring',
      'Smart allowance management',
      'Incident tracking and reporting',
      'Phone usage during driving alerts',
      'Automatic safety scoring',
      'Email notifications',
      'Weekly allowance automation',
      'Parent and teen dashboards',
      'Perfect week bonuses',
      'Speed compliance rewards'
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">DriveAllow Pro Plan</h3>
        <p className="text-gray-600">Start with a 7-day free trial, then $99/month for unlimited teen drivers</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg border-2 border-blue-200">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-blue-600">${plan.price}</div>
                <div className="text-lg text-gray-600">per month</div>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  7-day free trial
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={onContinue}
          size="lg"
          className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          data-testid="button-continue-to-payment"
        >
          Start Free Trial
        </Button>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>• 7-day free trial included</p>
        <p>• Cancel anytime with no charges</p>
        <p>• Unlimited teen drivers included</p>
        <p>• All features included</p>
      </div>
    </div>
  );
}