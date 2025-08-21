import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertTriangle, Shield, Calendar, Plus, Settings, Gift } from "lucide-react";
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
  const primaryTeen = teens[0]; // For demo, use first teen

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
              <h1 className="text-2xl font-bold text-primary">DriveWise</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Parent View</Badge>
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
                <span className="text-sm font-medium text-gray-700">
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
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      if (teens.length > 0) {
                        setSelectedTeenId(teens[0].id);
                        setShowReportModal(true);
                      }
                    }}
                    disabled={teens.length === 0}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Incident
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (teens.length > 0) {
                        setSelectedTeenId(teens[0].id);
                        setShowBonusModal(true);
                      }
                    }}
                    disabled={teens.length === 0}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Add Bonus
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (teens.length > 0) {
                        payAllowanceMutation.mutate(teens[0].id);
                      }
                    }}
                    disabled={teens.length === 0 || payAllowanceMutation.isPending}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {payAllowanceMutation.isPending ? 'Paying...' : 'Pay Allowance'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teen Status */}
            {primaryTeen && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {primaryTeen.firstName} {primaryTeen.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className="text-sm text-gray-900 capitalize">{primaryTeen.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm text-gray-900">{primaryTeen.email || 'Not set'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="mt-8">
          <SettingsPanel teenId={primaryTeen?.id} />
        </div>
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
