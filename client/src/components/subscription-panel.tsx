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
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
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

  const cancelTrialMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/subscription/cancel-trial");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({
        title: "Success",
        description: "Trial cancelled successfully.",
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
        description: "Failed to cancel trial. Please try again.",
        variant: "destructive",
      });
    },
  });

  const switchBillingMutation = useMutation({
    mutationFn: async (billingPeriod: 'monthly' | 'yearly') => {
      await apiRequest("POST", "/api/subscription/switch-billing", { billingPeriod });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.refetchQueries({ queryKey: ["/api/subscription"] });
      toast({
        title: "Success",
        description: "Billing period updated successfully!",
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
        description: "Failed to switch billing period. Please try again.",
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
        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold capitalize">
                  {subscription?.tier?.replace('_', ' ')} Plan
                </h3>
                <p className="text-gray-600 flex items-center text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  {subscription?.teenCount > 0 
                    ? `${subscription.teenCount} driver${subscription.teenCount !== 1 ? 's' : ''}`
                    : 'Unlimited drivers (no teens added yet)'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  ${subscription?.totalPrice}/{subscription?.billingPeriod === 'yearly' ? 'year' : 'month'}
                </div>
                {subscription?.billingPeriod === 'yearly' && (
                  <div className="text-xs text-green-600 font-medium">
                    Save $189/year
                  </div>
                )}
              </div>
            </div>

            {isTrialActive && !isTrialExpired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">Free Trial Active</h4>
                    <p className="text-blue-700 text-xs">
                      {trialDaysLeft > 0 
                        ? `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} remaining. Auto-upgrade unless cancelled.`
                        : 'Expires today. Auto-upgrade unless cancelled.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isTrialExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-red-900 text-sm">Trial Expired</h4>
                    <p className="text-red-700 text-xs">
                      Free trial ended. Select a paid plan to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {subscription?.phoneUsageAlertsEnabled && (
              <div className="flex items-center text-green-700 bg-green-50 rounded-lg p-2">
                <Smartphone className="h-3 w-3 mr-2" />
                <span className="text-xs">Phone usage alerts enabled</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Billing Period Switching */}
      {(subscription?.status === 'active' || subscription?.status === 'trial') && subscription?.status !== 'cancelled' && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Period</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Switch billing period. Yearly saves $189!
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => switchBillingMutation.mutate('monthly')}
                  disabled={switchBillingMutation.isPending || subscription?.billingPeriod === 'monthly'}
                  variant={subscription?.billingPeriod === 'monthly' ? 'default' : 'outline'}
                  className="h-auto p-3 flex flex-col"
                  data-testid="switch-monthly"
                >
                  <div className="font-medium text-sm">Monthly</div>
                  <div className="text-xs">$99/month</div>
                </Button>
                
                <Button
                  onClick={() => switchBillingMutation.mutate('yearly')}
                  disabled={switchBillingMutation.isPending || subscription?.billingPeriod === 'yearly'}
                  variant={subscription?.billingPeriod === 'yearly' ? 'default' : 'outline'}
                  className="h-auto p-3 flex flex-col relative"
                  data-testid="switch-yearly"
                >
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                    Save $189
                  </div>
                  <div className="font-medium text-sm">Yearly</div>
                  <div className="text-xs">$999/year</div>
                </Button>
              </div>
              
              {switchBillingMutation.isPending && (
                <div className="text-center text-xs text-gray-500">
                  Updating billing period...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Trial */}
      {isTrialActive && !isTrialExpired && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Cancel Trial</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-gray-600 mb-3 text-sm">
              Cancel trial anytime. Immediately ends access.
            </p>
            <Button
              onClick={() => cancelTrialMutation.mutate()}
              disabled={cancelTrialMutation.isPending}
              variant="destructive"
              size="sm"
              data-testid="cancel-trial"
            >
              {cancelTrialMutation.isPending ? 'Cancelling...' : 'Cancel Trial'}
            </Button>
          </CardContent>
        </Card>
      )}

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