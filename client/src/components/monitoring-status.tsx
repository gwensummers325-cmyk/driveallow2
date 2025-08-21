import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Activity, CheckCircle } from "lucide-react";

interface MonitoringStatusProps {
  teenId: string;
}

export function MonitoringStatus({ teenId }: MonitoringStatusProps) {
  const { data: monitoringStatus, isLoading } = useQuery({
    queryKey: ['/api/monitoring-status', teenId],
    refetchInterval: 15000, // Update every 15 seconds
  });

  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!monitoringStatus) return null;

  const {
    isMonitoring = false,
    safetyScore = 100,
    weeklyViolations = 0,
    autoDetected = 0,
    manuallyReported = 0,
    lastViolation = null,
    monitoringActive = true
  } = monitoringStatus || {};

  const getSafetyColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSafetyIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return Shield;
    return AlertTriangle;
  };

  const SafetyIcon = getSafetyIcon(safetyScore);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          Automated Detection
          {monitoringActive && (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
              • ACTIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Safety Score */}
        <div className={`p-3 rounded-lg border ${getSafetyColor(safetyScore)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SafetyIcon className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Safety Score</p>
                <p className="text-2xl font-bold">{safetyScore}%</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium">This Week</p>
              <p>{weeklyViolations} violations</p>
            </div>
          </div>
        </div>

        {/* Detection Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-700">Auto-Detected</p>
              <p className="text-xl font-bold text-orange-800">{autoDetected}</p>
              <p className="text-xs text-orange-600">violations</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Manual Reports</p>
              <p className="text-xl font-bold text-gray-800">{manuallyReported}</p>
              <p className="text-xs text-gray-600">violations</p>
            </div>
          </div>
        </div>

        {/* Last Violation */}
        {lastViolation && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Most Recent Violation</p>
                <p className="text-xs text-red-700">{(lastViolation as any)?.notes || (lastViolation as any)?.type}</p>
                <p className="text-xs text-red-600 mt-1">
                  {new Date((lastViolation as any)?.createdAt).toLocaleDateString()} at{' '}
                  {new Date((lastViolation as any)?.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {(lastViolation as any)?.location && (
                  <p className="text-xs text-red-600">{(lastViolation as any).location}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-600">Detection Status:</span>
          <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isMonitoring ? '✓ Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}