import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertTriangle, Shield, Calendar, Plus, Settings, Gift, DollarSign, CheckCircle } from "lucide-react";
import { ReportIncidentModal } from "@/components/report-incident-modal";
import { AddBonusModal } from "@/components/add-bonus-modal";
import { SettingsPanel } from "@/components/settings-panel";
import { CreateTeenModal } from "@/components/create-teen-modal";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Layout } from "@/components/layout";

export default function ParentDashboard() {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showCreateTeenModal, setShowCreateTeenModal] = useState(false);
  const [selectedTeenId, setSelectedTeenId] = useState<string>("");

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/dashboard/parent"],
    enabled: !!user && !isLoading,
  });

  const { data: owedTransactions } = useQuery({
    queryKey: ["/api/owed-transactions"],
    enabled: !!user && !isLoading,
  });

  const payAllowanceMutation = useMutation({
    mutationFn: async (teenId: string) => {
      await apiRequest("POST", "/api/allowance/pay", { teenId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
      toast({
        title: "Success",
        description: "Allowance paid successfully!",
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
        description: "Failed to pay allowance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      await apiRequest("POST", `/api/transactions/${transactionId}/mark-paid`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owed-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
      toast({
        title: "Success",
        description: "Transaction marked as paid!",
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
        description: "Failed to mark transaction as paid.",
        variant: "destructive",
      });
    },
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
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
  }, [user, isLoading, toast]);

  if (isLoading || isDashboardLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h1>
              <p className="text-gray-600">Unable to load dashboard data.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const { parent, teens, transactions } = dashboardData as any;

  const formatCurrency = (amount: string) => `$${parseFloat(amount).toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-green-500" />;
      case 'allowance':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'penalty':
        return 'text-red-600';
      case 'bonus':
      case 'allowance':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-primary">DriveAllow</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Badge variant="secondary" className="text-xs md:text-sm">Parent View</Badge>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  {parent.profileImageUrl ? (
                    <img src={parent.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {parent.firstName?.[0] || parent.email?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {parent.firstName} {parent.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Teen Drivers</p>
                  <p className="text-2xl font-bold text-gray-900">{teens.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={() => setShowCreateTeenModal(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teen Driver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week's Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-warning text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Managed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions
                        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)
                        .toString()
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Wallet className="text-success text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Teens</p>
                  <p className="text-2xl font-bold text-gray-900">{teens.filter((t: any) => t.role === 'teen').length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Owed Money Reminder */}
        {owedTransactions && Array.isArray(owedTransactions) && owedTransactions.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <DollarSign className="h-5 w-5 mr-2" />
                Money Owed to Teens
              </CardTitle>
              <p className="text-sm text-orange-700">
                These allowances and bonuses have been added to your teen's balance and need to be paid in real life.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {owedTransactions.map((transaction: any) => {
                  const teen = teens.find((t: any) => t.id === transaction.teenId);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {teen?.firstName} {teen?.lastName}
                          </span>
                          <span className="font-bold text-lg text-green-600">
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                            {transaction.type}
                          </span>
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        onClick={() => markAsPaidMutation.mutate(transaction.id)}
                        disabled={markAsPaidMutation.isPending}
                        className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                        data-testid={`button-mark-paid-${transaction.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {markAsPaidMutation.isPending ? 'Marking...' : 'Mark as Paid'}
                      </Button>
                    </div>
                  );
                })
              </div>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-orange-800">Total Amount Owed:</span>
                  <span className="font-bold text-xl text-orange-900">
                    ${owedTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Individual Teen Cards */}
        {teens.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Teen Drivers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {teens.map((teen: any) => (
                <Card key={teen.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          {teen.profileImageUrl ? (
                            <img src={teen.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium">
                              {teen.firstName?.[0]}{teen.lastName?.[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{teen.firstName} {teen.lastName}</CardTitle>
                          <p className="text-sm text-gray-600">{teen.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Balance */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Current Balance</p>
                            <p className="text-2xl font-bold text-green-800">
                              {formatCurrency(teen.balance?.currentBalance || '0.00')}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          Next allowance: {teen.balance?.nextAllowanceDate 
                            ? new Date(teen.balance.nextAllowanceDate).toLocaleDateString() 
                            : 'Not scheduled'}
                        </div>
                      </div>

                      {/* Allowance Settings */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-700 mb-3">Allowance Settings</p>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Allowance:</span>
                            <span className="font-medium text-sm text-right whitespace-nowrap">{formatCurrency(teen.settings?.allowanceAmount || '50.00')}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Frequency:</span>
                            <span className="font-medium text-sm capitalize text-right">{teen.settings?.frequency || 'weekly'}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Speed 3-10mph:</span>
                            <span className="font-medium text-sm text-right whitespace-nowrap">{formatCurrency(teen.settings?.speedingMinorPenalty || '5.00')}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Speed 11+mph:</span>
                            <span className="font-medium text-sm text-right whitespace-nowrap">{formatCurrency(teen.settings?.speedingMajorPenalty || '10.00')}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Harsh Braking:</span>
                            <span className="font-medium text-sm text-right whitespace-nowrap">{formatCurrency(teen.settings?.harshBrakingPenalty || '5.00')}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-blue-600 text-sm">Hard Accel:</span>
                            <span className="font-medium text-sm text-right whitespace-nowrap">{formatCurrency(teen.settings?.aggressiveAccelPenalty || '5.00')}</span>
                          </div>
                        </div>
                      </div>


                      {/* Auto-Detection Status */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-600">Auto-monitoring active</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Most violations detected automatically</p>
                      </div>


                      {/* Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTeenId(teen.id);
                            setShowReportModal(true);
                          }}
                          className="text-xs md:text-sm border-orange-200 text-orange-700 hover:bg-orange-50 min-h-[36px]"
                          title="Report incidents not captured by automatic monitoring"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span className="hidden xs:inline">Manual </span>Report
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-xs md:text-sm min-h-[36px]"
                          onClick={() => {
                            setSelectedTeenId(teen.id);
                            setShowBonusModal(true);
                          }}
                        >
                          <Gift className="h-3 w-3 mr-1" />
                          Add Bonus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 6).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        {transaction.location && (
                          <p className="text-xs text-gray-600">{transaction.location}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.createdAt!)} at {formatTime(transaction.createdAt!)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                          {parseFloat(transaction.amount) >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Status */}
          <div className="space-y-6">

            {/* Family Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Family Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Teen Drivers</span>
                    <span className="text-sm font-medium">{teens.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Combined Balance</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(
                        teens.reduce((sum: number, teen: any) => 
                          sum + parseFloat(teen.balance?.currentBalance || '0.00'), 0
                        ).toString()
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Allowance Total</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        teens.reduce((sum: number, teen: any) => 
                          sum + parseFloat(teen.settings?.allowanceAmount || '50.00'), 0
                        ).toString()
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Settings Panel */}
        {teens.length > 0 && (
          <div className="mt-8">
            <SettingsPanel 
              teenId={selectedTeenId || teens[0]?.id} 
              teens={teens}
              onTeenChange={setSelectedTeenId}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ReportIncidentModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        teenId={selectedTeenId}
      />
      
      <AddBonusModal
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
        teenId={selectedTeenId}
        teenName={teens.find((t: any) => t.id === selectedTeenId)?.firstName || ''}
      />

      <CreateTeenModal
        isOpen={showCreateTeenModal}
        onClose={() => setShowCreateTeenModal(false)}
      />
      </div>
    </Layout>
  );
}
