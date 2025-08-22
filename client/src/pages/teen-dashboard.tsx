import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Shield, Construction, AlertTriangle, Star, Car, TrendingUp, Target } from "lucide-react";
import { MonitoringStatus } from "@/components/monitoring-status";
import { Layout } from "@/components/layout";

export default function TeenDashboard() {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/dashboard/teen"],
    enabled: !!user && !isLoading,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Please sign in again.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth/teen";
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

  const { teen, balance, transactions, incidents, weeklyViolations } = dashboardData as any;

  const formatCurrency = (amount: string) => `$${parseFloat(amount).toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bonus':
        return <Star className="h-4 w-4 text-green-500" />;
      case 'allowance':
        return <PiggyBank className="h-4 w-4 text-blue-500" />;
      default:
        return <PiggyBank className="h-4 w-4 text-gray-500" />;
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

  const currentBalance = parseFloat(balance.currentBalance);
  const safetyScore = Math.max(0, Math.min(100, 100 - (weeklyViolations * 10))); // Simple calculation
  const weeklyMiles = 127; // Mock data for now
  const weeklyGoal = 150;
  const milesProgress = (weeklyMiles / weeklyGoal) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">DriveAllow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Teen View</Badge>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  {teen.profileImageUrl ? (
                    <img src={teen.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {teen.firstName?.[0] || teen.email?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {teen.firstName} {teen.lastName}
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
                  <p className="text-sm font-medium text-gray-600">My Balance</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(balance.currentBalance)}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <PiggyBank className="text-success text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next allowance</span>
                  <span className="text-gray-900 font-medium">
                    {balance.nextAllowanceDate ? new Date(balance.nextAllowanceDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Safety Score</p>
                  <p className="text-3xl font-bold text-gray-900">{safetyScore}%</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Shield className="text-warning text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={safetyScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Miles This Week</p>
                  <p className="text-3xl font-bold text-gray-900">{weeklyMiles}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Construction className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Goal: {weeklyGoal} miles</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Violations</p>
                  <p className="text-3xl font-bold text-gray-900">{weeklyViolations}</p>
                </div>
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-error text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-error font-medium">This week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driving History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Driving History</CardTitle>
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
                      <p className="text-gray-500">No driving history yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals & Earning Opportunities */}
          <div className="space-y-6">

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">No violations</span>
                      <span className={`font-medium ${weeklyViolations === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weeklyViolations === 0 ? '✓ Complete' : `${weeklyViolations} violations`}
                      </span>
                    </div>
                    <Progress 
                      value={weeklyViolations === 0 ? 100 : Math.max(0, 100 - (weeklyViolations * 20))} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Complete weekly miles</span>
                      <span className="text-primary font-medium">{weeklyMiles}/{weeklyGoal} miles</span>
                    </div>
                    <Progress value={milesProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Maintain safety score</span>
                      <span className="text-warning font-medium">{safetyScore}%</span>
                    </div>
                    <Progress value={safetyScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earning Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Earn Extra Money</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Perfect Week Bonus</p>
                        <p className="text-xs text-gray-600">No violations for 7 days</p>
                      </div>
                      <span className="text-green-600 font-semibold">+$10</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Speed Limit Champion</p>
                        <p className="text-xs text-gray-600">Stay within speed limits</p>
                      </div>
                      <span className="text-green-600 font-semibold">+$2/day</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Safe Driving Streak</p>
                        <p className="text-xs text-gray-600">Current streak: {weeklyViolations === 0 ? '7' : '0'} days</p>
                      </div>
                      <span className="text-green-600 font-semibold">+$5/week</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Driving Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Driving Tips & Safety Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-primary text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Watch Your Speed</h4>
                  <p className="text-xs text-gray-600">
                    Check speed limit signs regularly and use cruise control on highways to maintain consistent speeds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="text-success text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Smooth Driving</h4>
                  <p className="text-xs text-gray-600">
                    Accelerate and brake gradually. Look ahead and anticipate traffic changes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="text-warning text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Stay Focused</h4>
                  <p className="text-xs text-gray-600">
                    Keep phones away, maintain following distance, and always wear your seatbelt.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </Layout>
  );
}
