import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CreditCard, Pause, Play, AlertCircle, DollarSign } from 'lucide-react';

interface StripeCardManagementProps {
  teenId: string;
  isParent: boolean;
  onCardUpdate?: () => void;
}

interface CardData {
  hasCard: boolean;
  card?: {
    id: string;
    last4: string;
    type: 'virtual' | 'physical';
    status: string;
    spending_controls?: {
      spending_limits?: Array<{
        amount: number;
        interval: string;
      }>;
    };
  };
  recentTransactions?: Array<{
    id: string;
    amount: number;
    merchant: string;
    created: number;
    status: string;
  }>;
}

export function StripeCardManagement({ teenId, isParent, onCardUpdate }: StripeCardManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequestingCard, setIsRequestingCard] = useState(false);

  // Fetch card data
  const { data: cardData, isLoading } = useQuery<CardData>({
    queryKey: ['/api/stripe/card', teenId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/stripe/card/${teenId}`);
      return response.json();
    },
  });

  // Setup parent Stripe account
  const setupParentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stripe/setup-parent');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Account Ready",
        description: "Your payment account has been set up successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Request allowance card
  const requestCardMutation = useMutation({
    mutationFn: async (cardType: 'virtual' | 'physical') => {
      const response = await apiRequest('POST', '/api/stripe/request-card', {
        teenId,
        cardType,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/card', teenId] });
      onCardUpdate?.();
      toast({
        title: "Card Created Successfully",
        description: `${data.cardType === 'virtual' ? 'Virtual' : 'Physical'} allowance card ending in ${data.last4} has been created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Card Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Suspend/reactivate card
  const cardControlMutation = useMutation({
    mutationFn: async (action: 'suspend' | 'reactivate') => {
      const response = await apiRequest('POST', `/api/stripe/card/${teenId}/${action}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/card', teenId] });
      onCardUpdate?.();
      toast({
        title: `Card ${data.action === 'suspend' ? 'Suspended' : 'Reactivated'}`,
        description: `The allowance card has been ${data.action === 'suspend' ? 'suspended' : 'reactivated'} successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Card Control Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRequestCard = async (cardType: 'virtual' | 'physical') => {
    setIsRequestingCard(true);
    try {
      // First ensure parent has Stripe account
      await setupParentMutation.mutateAsync();
      // Then request the card
      await requestCardMutation.mutateAsync(cardType);
    } catch (error) {
      // Error handling is done in mutation onError
    } finally {
      setIsRequestingCard(false);
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="card-stripe-loading">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  const dailyLimit = cardData?.card?.spending_controls?.spending_limits?.find(
    limit => limit.interval === 'daily'
  )?.amount;

  return (
    <Card data-testid="card-stripe-management">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {isParent ? 'Allowance Card Management' : 'My Allowance Card'}
        </CardTitle>
        <CardDescription>
          {isParent 
            ? 'Manage your teen\'s real money allowance card with automatic spending controls'
            : 'Your allowance card automatically syncs with your driving performance'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!cardData?.hasCard ? (
          // No card exists - show request options
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Real Money Allowance Cards
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Request a real debit card that automatically adjusts spending limits based on driving behavior.
                    Safe driving = more spending power. Violations = restricted access.
                  </p>
                </div>
              </div>
            </div>

            {isParent && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => handleRequestCard('virtual')}
                  disabled={isRequestingCard || requestCardMutation.isPending}
                  className="h-auto p-4 justify-start"
                  data-testid="button-request-virtual-card"
                >
                  <div className="text-left">
                    <div className="font-medium">Virtual Card</div>
                    <div className="text-sm opacity-90">
                      Free • Instant • Apple/Google Pay
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleRequestCard('physical')}
                  disabled={isRequestingCard || requestCardMutation.isPending}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  data-testid="button-request-physical-card"
                >
                  <div className="text-left">
                    <div className="font-medium">Physical Card</div>
                    <div className="text-sm opacity-90">
                      $3 fee • 5-7 business days
                    </div>
                  </div>
                </Button>
              </div>
            )}

            {!isParent && (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  Ask your parent to request an allowance card for you through their dashboard.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Card exists - show card details and controls
          <div className="space-y-6">
            {/* Card Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">
                    {cardData.card?.type === 'virtual' ? 'Virtual' : 'Physical'} Card
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    •••• •••• •••• {cardData.card?.last4}
                  </div>
                </div>
              </div>
              <Badge 
                variant={cardData.card?.status === 'active' ? 'default' : 'secondary'}
                data-testid={`badge-card-status-${cardData.card?.status}`}
              >
                {cardData.card?.status === 'active' ? 'Active' : 'Suspended'}
              </Badge>
            </div>

            {/* Spending Limit */}
            {dailyLimit && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    Daily Spending Limit
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    ${(dailyLimit / 100).toFixed(2)} per day (synced with allowance balance)
                  </div>
                </div>
              </div>
            )}

            {/* Card Controls (Parent Only) */}
            {isParent && (
              <div className="flex gap-2">
                {cardData.card?.status === 'active' ? (
                  <Button
                    onClick={() => cardControlMutation.mutate('suspend')}
                    disabled={cardControlMutation.isPending}
                    variant="destructive"
                    size="sm"
                    data-testid="button-suspend-card"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Suspend Card
                  </Button>
                ) : (
                  <Button
                    onClick={() => cardControlMutation.mutate('reactivate')}
                    disabled={cardControlMutation.isPending}
                    size="sm"
                    data-testid="button-reactivate-card"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Reactivate Card
                  </Button>
                )}
              </div>
            )}

            {/* Recent Transactions */}
            {cardData.recentTransactions && cardData.recentTransactions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Recent Purchases</h4>
                <div className="space-y-2">
                  {cardData.recentTransactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      data-testid={`transaction-${transaction.id}`}
                    >
                      <div>
                        <div className="font-medium">{transaction.merchant}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.created * 1000).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          -${transaction.amount.toFixed(2)}
                        </div>
                        <Badge variant="outline">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}