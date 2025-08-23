import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  X, 
  Clock, 
  Users, 
  Smartphone,
  AlertTriangle,
  Crown
} from "lucide-react";

export function SubscriptionPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch subscription data
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["/api/subscription"],
  }) as { data: any, isLoading: boolean };

  // Fetch pricing for both tiers
  const { data: safetyFirstPricing } = useQuery({
    queryKey: ["/api/subscription/pricing/safety_first", subscription?.teenCount || 1],
    queryFn: () => fetch(`/api/subscription/pricing/safety_first?teenCount=${subscription?.teenCount || 1}`).then(res => res.json()),
    enabled: !!subscription,
  }) as { data: any };

  const { data: safetyPlusPricing } = useQuery({
    queryKey: ["/api/subscription/pricing/safety_plus", subscription?.teenCount || 1],
    queryFn: () => fetch(`/api/subscription/pricing/safety_plus?teenCount=${subscription?.teenCount || 1}`).then(res => res.json()),
    enabled: !!subscription,
  }) as { data: any };

  const selectTierMutation = useMutation({
    mutationFn: async (tier: 'safety_first' | 'safety_plus') => {
      await apiRequest("POST", "/api/subscription/select-tier", { tier });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({
        title: "Success",
        description: "Subscription tier updated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth/parent";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update subscription tier. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/subscription/cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({
        title: "Success",
        description: "Subscription cancelled successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth/parent";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading subscription information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isTrialActive = subscription?.status === 'trial';
  const isTrialExpired = subscription?.trialEndDate && new Date(subscription.trialEndDate) < new Date();
  const trialDaysLeft = subscription?.trialEndDate 
    ? Math.ceil((new Date(subscription.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const getStatusBadge = () => {
    switch (subscription?.status) {
      case 'trial':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Free Trial
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Current Subscription
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {subscription?.tier?.replace('_', ' ')} Plan
                </h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  {subscription?.teenCount || 0} teen driver{(subscription?.teenCount || 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${subscription?.totalPrice}/month</div>
                {subscription?.additionalTeenPrice !== '0.00' && (
                  <div className="text-sm text-gray-600">
                    Base: ${subscription?.basePrice} + ${subscription?.additionalTeenPrice} additional
                  </div>
                )}
              </div>
            </div>

            {isTrialActive && !isTrialExpired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Free Trial Active</h4>
                    <p className="text-blue-700 text-sm">
                      {trialDaysLeft > 0 
                        ? `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} remaining. Your trial will auto-upgrade to paid unless cancelled.`
                        : 'Your trial expires today. It will auto-upgrade to paid unless cancelled.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isTrialExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <h4 className="font-semibold text-red-900">Trial Expired</h4>
                    <p className="text-red-700 text-sm">
                      Your free trial has ended. Please select a paid plan to continue using DriveAllow.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {subscription?.phoneUsageAlertsEnabled && (
              <div className="flex items-center text-green-700 bg-green-50 rounded-lg p-3">
                <Smartphone className="h-4 w-4 mr-2" />
                <span className="text-sm">Phone usage alerts during driving enabled</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety First Tier */}
        <Card className={`${subscription?.tier === 'safety_first' ? 'ring-2 ring-primary border-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Safety First
              </div>
              {subscription?.tier === 'safety_first' && (
                <Badge className="bg-primary text-white">Current</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">${safetyFirstPricing?.totalPrice}/month</div>
                <div className="text-sm text-gray-600">
                  For {subscription?.teenCount || 1} teen driver{(subscription?.teenCount || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              
              <ul className="space-y-2 text-sm">
                {safetyFirstPricing?.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {subscription?.tier !== 'safety_first' && (
                <Button
                  onClick={() => selectTierMutation.mutate('safety_first')}
                  disabled={selectTierMutation.isPending}
                  className="w-full"
                  variant="outline"
                  data-testid="select-safety-first"
                >
                  {selectTierMutation.isPending ? 'Updating...' : 'Select Safety First'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safety Plus Tier */}
        <Card className={`${subscription?.tier === 'safety_plus' ? 'ring-2 ring-primary border-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                Safety Plus
              </div>
              {subscription?.tier === 'safety_plus' && (
                <Badge className="bg-primary text-white">Current</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">${safetyPlusPricing?.totalPrice}/month</div>
                <div className="text-sm text-gray-600">
                  For {subscription?.teenCount || 1} teen driver{(subscription?.teenCount || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              
              <ul className="space-y-2 text-sm">
                {safetyPlusPricing?.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {subscription?.tier !== 'safety_plus' && (
                <Button
                  onClick={() => selectTierMutation.mutate('safety_plus')}
                  disabled={selectTierMutation.isPending}
                  className="w-full"
                  data-testid="select-safety-plus"
                >
                  {selectTierMutation.isPending ? 'Updating...' : 'Select Safety Plus'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription */}
      {subscription?.status !== 'cancelled' && !isTrialActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Cancel Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you cancel your subscription, you'll still have access until the end of your current billing period.
            </p>
            <Button
              onClick={() => cancelSubscriptionMutation.mutate()}
              disabled={cancelSubscriptionMutation.isPending}
              variant="destructive"
              data-testid="cancel-subscription"
            >
              {cancelSubscriptionMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}