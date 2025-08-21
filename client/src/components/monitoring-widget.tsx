import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Activity,
  AlertTriangle,
  Car,
  Gauge,
  Shield,
  Navigation,
  Eye,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface MonitoringWidgetProps {
  teenId?: string;
}

export function MonitoringWidget({ teenId }: MonitoringWidgetProps) {
  const [, setLocation] = useLocation();
  
  const { data: monitoringData } = useQuery<any>({
    queryKey: ["/api/monitoring/widget", teenId],
    refetchInterval: 10000, // Refresh every 10 seconds
    enabled: !!teenId,
  });

  const { data: activeTrip } = useQuery<any>({
    queryKey: ["/api/monitoring/active-trip", teenId],
    refetchInterval: 5000, // More frequent for active trips
    enabled: !!teenId,
  });

  if (!monitoringData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Activity className="mr-2 h-4 w-4" />
            Live Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading monitoring data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { 
    safetyScore = 100, 
    weeklyViolations = 0, 
    totalMiles = 0,
    averageSpeed = 0,
    lastViolation,
    isCurrentlyDriving = false
  } = monitoringData as any;

  const formatSpeed = (speed: number) => `${speed.toFixed(1)} mph`;
  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm">
            <Activity className="mr-2 h-4 w-4" />
            Live Monitoring
          </CardTitle>
          {isCurrentlyDriving && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Badge className="bg-green-100 text-green-800 text-xs">Driving</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Trip Status */}
        {activeTrip ? (
          <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Active Trip</span>
              </div>
              <Badge className="text-xs">
                {activeTrip?.currentSpeed ? formatSpeed(activeTrip.currentSpeed) : 'Parked'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Started: {activeTrip?.startTime ? formatTime(activeTrip.startTime) : 'Unknown'}</div>
              <div>Distance: {activeTrip?.totalDistance?.toFixed(1) || '0.0'} mi</div>
            </div>
            {activeTrip?.currentSpeed && activeTrip?.speedLimit && (
              <div className="mt-2 p-2 bg-white rounded border">
                <div className="flex items-center justify-between text-xs">
                  <span>Speed vs Limit:</span>
                  <span className={
                    activeTrip.currentSpeed > activeTrip.speedLimit ? 'text-red-600 font-semibold' : 'text-green-600'
                  }>
                    {formatSpeed(activeTrip.currentSpeed)} / {formatSpeed(activeTrip.speedLimit)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : !isCurrentlyDriving && (
          <div className="text-center py-3 text-gray-500">
            <Car className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Not currently driving</p>
          </div>
        )}

        {/* Safety Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-xs text-gray-600">Safety Score</span>
            </div>
            <div className={`text-lg font-bold ${
              safetyScore >= 90 ? 'text-green-600' : safetyScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {safetyScore.toFixed(0)}/100
            </div>
            <div className="flex items-center justify-center text-xs">
              {safetyScore >= 90 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={safetyScore >= 90 ? "text-green-600" : "text-red-600"}>
                {safetyScore >= 90 ? "Excellent" : "Needs work"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-xs text-gray-600">This Week</span>
            </div>
            <div className={`text-lg font-bold ${
              weeklyViolations === 0 ? 'text-green-600' : weeklyViolations <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {weeklyViolations}
            </div>
            <div className="text-xs text-gray-500">Violations</div>
          </div>
        </div>

        {/* Driving Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Navigation className="h-3 w-3 text-blue-600 mr-1" />
              <span className="text-xs text-gray-600">Total Miles</span>
            </div>
            <div className="text-sm font-semibold">{totalMiles.toFixed(0)}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Gauge className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-gray-600">Avg Speed</span>
            </div>
            <div className="text-sm font-semibold">{formatSpeed(averageSpeed)}</div>
          </div>
        </div>

        {/* Last Violation Alert */}
        {lastViolation && (
          <div className="border-l-4 border-l-red-500 bg-red-50 p-2 rounded">
            <div className="flex items-center text-red-800 text-xs mb-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Last Violation
            </div>
            <div className="text-xs text-gray-600">
              {lastViolation.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              {lastViolation.speedRecorded && (
                <span className="ml-2 text-red-600 font-semibold">
                  {formatSpeed(parseFloat(lastViolation.speedRecorded))}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(lastViolation.createdAt).toLocaleDateString()} at{' '}
              {formatTime(lastViolation.createdAt)}
            </div>
          </div>
        )}

        {/* View Full Dashboard Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4"
          onClick={() => setLocation('/monitoring')}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Full Monitor
        </Button>
      </CardContent>
    </Card>
  );
}