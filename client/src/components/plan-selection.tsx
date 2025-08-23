import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, SmartphoneNfc, Star } from "lucide-react";

interface PlanSelectionProps {
  selectedPlan: 'safety_first' | 'safety_plus' | null;
  onPlanSelect: (plan: 'safety_first' | 'safety_plus') => void;
  onContinue: () => void;
}

export function PlanSelection({ selectedPlan, onPlanSelect, onContinue }: PlanSelectionProps) {
  const plans = [
    {
      id: 'safety_first' as const,
      name: 'Safety First',
      price: 19.99,
      description: 'Essential teen driving monitoring',
      icon: Shield,
      features: [
        'Driving behavior monitoring',
        'Allowance management',
        'Incident reporting',
        'Safety scoring',
        'Email notifications',
        'Weekly allowance automation'
      ],
      additionalTeenPrice: 8.99
    },
    {
      id: 'safety_plus' as const,
      name: 'Safety Plus',
      price: 29.99,
      description: 'Complete teen safety solution',
      icon: SmartphoneNfc,
      popular: true,
      features: [
        'All Safety First features',
        'Phone usage monitoring',
        'Advanced analytics',
        'Priority support',
        'Custom incident alerts',
        'Real-time notifications'
      ],
      additionalTeenPrice: 9.99
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
        <p className="text-gray-600">Start with a 7-day free trial, then continue with your selected plan</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => onPlanSelect(plan.id)}
              data-testid={`card-plan-${plan.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.popular && (
                          <Badge variant="default" className="bg-orange-500">
                            <Star className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-2">
                  <div className="text-3xl font-bold">${plan.price}</div>
                  <div className="text-sm text-gray-600">per month</div>
                  <div className="text-xs text-gray-500 mt-1">
                    +${plan.additionalTeenPrice}/month per additional teen
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onPlanSelect(plan.id)}
                  data-testid={`button-select-${plan.id}`}
                >
                  {isSelected ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          onClick={onContinue}
          disabled={!selectedPlan}
          size="lg"
          className="px-8"
          data-testid="button-continue-to-payment"
        >
          Continue to Payment
        </Button>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>• 7-day free trial for all plans</p>
        <p>• Cancel anytime during trial with no charges</p>
        <p>• All plans include unlimited teen monitoring</p>
      </div>
    </div>
  );
}