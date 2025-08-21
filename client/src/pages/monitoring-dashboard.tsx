import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Activity,
  AlertTriangle,
  Car,
  MapPin,
  Gauge,
  Clock,
  Shield,
  TrendingUp,
  TrendingDown,
  Bell,
  Eye,
  Navigation,
  Zap,
  Route
} from "lucide-react";

export default function MonitoringDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeenId, setSelectedTeenId] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: monitoringData, isLoading: isMonitoringLoading } = useQuery({
    queryKey: ["/api/monitoring/dashboard"],
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds
    enabled: !!user && !isLoading,
  });

  const { data: activeTrips = [] } = useQuery<any[]>({
    queryKey: ["/api/monitoring/active-trips"],
    refetchInterval: autoRefresh ? 3000 : false, // More frequent for active trips
    enabled: !!user && !isLoading,
  });

  const { data: recentViolations = [] } = useQuery<any[]>({
    queryKey: ["/api/monitoring/violations", selectedTeenId],
    refetchInterval: autoRefresh ? 10000 : false,
    enabled: !!user && !isLoading,
  });

  const { data: alerts = [] } = useQuery<any[]>({
    queryKey: ["/api/monitoring/alerts"],
    refetchInterval: autoRefresh ? 5000 : false,
    enabled: !!user && !isLoading,
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

  if (isLoading || isMonitoringLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading monitoring dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { teens = [], totalActiveTrips = 0, averageSpeed = 0, safetyScore = 100 } = monitoringData as any || {};

  const formatSpeed = (speed: number) => `${speed.toFixed(1)} mph`;
  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getViolationIcon = (type: string) => {
    switch (type) {
      case 'speeding_minor':
      case 'speeding_major':
        return <Gauge className="h-4 w-4" />;
      case 'harsh_braking':
        return <AlertTriangle className="h-4 w-4" />;
      case 'aggressive_acceleration':
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Driving Monitor</h1>
              <p className="mt-1 text-sm text-gray-600">Real-time tracking and safety monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className={`h-4 w-4 ${autoRefresh ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {autoRefresh ? 'Live' : 'Paused'}
                </span>
              </div>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? "Pause" : "Resume"} Updates
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Trips</CardTitle>
                <Car className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalActiveTrips}</div>
                <p className="text-xs text-gray-500">Teen drivers currently driving</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Speed</CardTitle>
                <Gauge className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatSpeed(averageSpeed)}</div>
                <p className="text-xs text-gray-500">Across all active trips</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Safety Score</CardTitle>
                <Shield className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safetyScore.toFixed(0)}/100</div>
                <div className="flex items-center text-xs">
                  {safetyScore >= 90 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={safetyScore >= 90 ? "text-green-600" : "text-red-600"}>
                    {safetyScore >= 90 ? "Excellent" : "Needs improvement"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Unread Alerts</CardTitle>
                <Bell className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.filter((a: any) => !a.isRead).length}</div>
                <p className="text-xs text-gray-500">Require your attention</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="live" className="space-y-6">
            <TabsList>
              <TabsTrigger value="live">Live Tracking</TabsTrigger>
              <TabsTrigger value="violations">Recent Violations</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="trips">Trip History</TabsTrigger>
            </TabsList>

            {/* Live Tracking Tab */}
            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Trips */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Navigation className="mr-2 h-5 w-5" />
                        Active Trips ({activeTrips.length})
                      </CardTitle>
                      {activeTrips.length > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Live
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeTrips.length === 0 ? (
                        <div className="text-center py-8">
                          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No active trips right now</p>
                          <p className="text-sm text-gray-400">All teens are parked safely</p>
                        </div>
                      ) : (
                        activeTrips.map((trip: any) => (
                          <div key={trip.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">{trip.teenName}</span>
                              </div>
                              <Badge className="text-xs">
                                {trip.currentSpeed ? formatSpeed(trip.currentSpeed) : 'Parked'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Started {formatTime(trip.startTime)}
                              </div>
                              <div className="flex items-center">
                                <Route className="h-3 w-3 mr-1" />
                                {trip.totalDistance?.toFixed(1) || '0.0'} mi
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {trip.currentLocation || trip.startLocation || 'Unknown'}
                              </div>
                              <div className="flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                Score: {trip.safetyScore?.toFixed(0) || 100}/100
                              </div>
                            </div>

                            {trip.recentViolations?.length > 0 && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <div className="flex items-center text-red-800 text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {trip.recentViolations.length} recent violations
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Speed & Behavior Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gauge className="mr-2 h-5 w-5" />
                      Speed Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teens.map((teen: any) => (
                        <div key={teen.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{teen.firstName} {teen.lastName}</span>
                            <div className="flex items-center space-x-2">
                              {teen.isCurrentlyDriving ? (
                                <Badge className="bg-green-100 text-green-800">Driving</Badge>
                              ) : (
                                <Badge variant="secondary">Parked</Badge>
                              )}
                            </div>
                          </div>
                          
                          {teen.isCurrentlyDriving && (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <p className="text-gray-600">Current</p>
                                <p className="font-semibold text-lg">
                                  {formatSpeed(teen.currentSpeed || 0)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-600">Limit</p>
                                <p className="font-semibold text-lg">
                                  {formatSpeed(teen.speedLimit || 35)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-600">Status</p>
                                <p className={`font-semibold text-lg ${
                                  (teen.currentSpeed || 0) > (teen.speedLimit || 35) ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {(teen.currentSpeed || 0) > (teen.speedLimit || 35) ? 'Over' : 'OK'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recent Violations Tab */}
            <TabsContent value="violations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Recent Violations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentViolations.length === 0 ? (
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent violations</p>
                        <p className="text-sm text-gray-400">Great driving behavior!</p>
                      </div>
                    ) : (
                      recentViolations.map((violation: any) => (
                        <div key={violation.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getViolationIcon(violation.type)}
                              <span className="font-medium">{violation.teenName}</span>
                            </div>
                            <Badge className={getSeverityColor(violation.severity)}>
                              {violation.severity}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Violation Type:</span>
                              <span className="font-medium">
                                {violation.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                            </div>
                            
                            {violation.speedRecorded && (
                              <div className="flex items-center justify-between">
                                <span>Speed Recorded:</span>
                                <span className="font-medium text-red-600">
                                  {formatSpeed(parseFloat(violation.speedRecorded))} 
                                  (limit: {formatSpeed(parseFloat(violation.speedLimit || '35'))})
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span>Location:</span>
                              <span>{violation.location || 'Unknown'}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span>Time:</span>
                              <span>{formatDate(violation.createdAt)} at {formatTime(violation.createdAt)}</span>
                            </div>
                            
                            {violation.autoReported && (
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                <div className="flex items-center text-blue-800 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Automatically detected and reported
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Monitoring Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No alerts</p>
                        <p className="text-sm text-gray-400">Everything looks good</p>
                      </div>
                    ) : (
                      alerts.map((alert: any) => (
                        <Alert key={alert.id} className={`border-l-4 ${
                          alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                          alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                          alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                          'border-l-blue-500 bg-blue-50'
                        } ${!alert.isRead ? 'font-semibold' : ''}`}>
                          <div className="flex items-center justify-between">
                            <AlertDescription className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">{alert.teenName}</span>
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p>{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(alert.createdAt)} at {formatTime(alert.createdAt)}
                              </p>
                            </AlertDescription>
                            {!alert.isRead && (
                              <Badge variant="destructive" className="ml-2">New</Badge>
                            )}
                          </div>
                        </Alert>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trip History Tab */}
            <TabsContent value="trips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Route className="mr-2 h-5 w-5" />
                    Recent Trip History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Trip history coming soon</p>
                    <p className="text-sm text-gray-400">Detailed trip analytics and reports</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Layout>
  );
}