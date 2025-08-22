import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, MapPin, Activity, AlertTriangle, CheckCircle, Lock, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Layout } from '@/components/layout';

interface SensorReading {
  timestamp: string;
  gps: {
    latitude: number;
    longitude: number;
    speed?: number;
    accuracy?: number;
  };
  accelerometer: {
    x: number;
    y: number;
    z: number;
    timestamp: number;
  };
}

interface PermissionState {
  location: 'granted' | 'denied' | 'prompt' | 'unknown';
  motion: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export default function MobileDataSender() {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [lastUpload, setLastUpload] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);
  const [violations, setViolations] = useState(0);
  const [selectedTeenId, setSelectedTeenId] = useState<string>('');
  const [permissions, setPermissions] = useState<PermissionState>({
    location: 'unknown',
    motion: 'unknown'
  });
  const [sensorError, setSensorError] = useState<string | null>(null);
  
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);
  const motionDataRef = useRef<DeviceMotionEvent | null>(null);
  const handleMotionRef = useRef<((event: DeviceMotionEvent) => void) | null>(null);

  // Check and request permissions
  const requestPermissions = async () => {
    setSensorError(null);
    
    // Request location permission
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
        
        setPermissions(prev => ({ ...prev, location: 'granted' }));
        lastPositionRef.current = position;
      } catch (error) {
        setPermissions(prev => ({ ...prev, location: 'denied' }));
        setSensorError('Location access denied. Please enable location services.');
        return false;
      }
    } else {
      setSensorError('Geolocation is not supported by this browser.');
      return false;
    }

    // Request motion permission (iOS 13+) - but don't fail if it doesn't work
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setPermissions(prev => ({ ...prev, motion: permission }));
        if (permission !== 'granted') {
          console.log('Motion sensor access denied, continuing with GPS only');
          setPermissions(prev => ({ ...prev, motion: 'denied' }));
        }
      } catch (error) {
        console.log('Motion sensor permission failed, continuing with GPS only');
        setPermissions(prev => ({ ...prev, motion: 'denied' }));
      }
    } else if ('DeviceMotionEvent' in window) {
      // Android and older iOS
      setPermissions(prev => ({ ...prev, motion: 'granted' }));
    } else {
      console.log('Motion sensors not supported, using GPS only');
      setPermissions(prev => ({ ...prev, motion: 'denied' }));
    }

    return true; // Always continue - GPS is the main requirement
  };

  // Get real device sensor data
  useEffect(() => {
    let geoInterval: NodeJS.Timeout;
    
    if (isTracking && permissions.location === 'granted') {
      // Start GPS tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          lastPositionRef.current = position;
        },
        (error) => {
          console.error('GPS error:', error);
          setSensorError('GPS tracking error: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      );

      // Motion event listener
      const handleMotion = (event: DeviceMotionEvent) => {
        motionDataRef.current = event;
      };
      handleMotionRef.current = handleMotion;

      window.addEventListener('devicemotion', handleMotion);

      // Collect data every second
      geoInterval = setInterval(() => {
        const position = lastPositionRef.current;
        const motion = motionDataRef.current;

        if (position) {
          const reading: SensorReading = {
            timestamp: new Date().toISOString(),
            gps: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed || 0, // m/s from GPS
              accuracy: position.coords.accuracy
            },
            accelerometer: {
              // Use motion data if available, otherwise use zeros
              x: (motion && motion.acceleration) ? motion.acceleration.x || 0 : 0,
              y: (motion && motion.acceleration) ? motion.acceleration.y || 0 : 0,
              z: (motion && motion.acceleration) ? motion.acceleration.z || 0 : 0,
              timestamp: Date.now()
            }
          };
          
          setSensorData(prev => [...prev.slice(-99), reading]); // Keep last 100 readings
        }
      }, 1000);
    }
    
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (geoInterval) {
        clearInterval(geoInterval);
      }
      if (handleMotionRef.current) {
        window.removeEventListener('devicemotion', handleMotionRef.current);
      }
    };
  }, [isTracking, permissions]);

  const startTracking = async () => {
    setSensorError(null);
    const permissionsGranted = await requestPermissions();
    
    if (permissionsGranted) {
      setIsTracking(true);
      setSensorData([]);
      setViolations(0);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };

  // Determine which teen ID to use
  const getTeenId = () => {
    if (user?.role === 'teen') {
      return user.id; // Teens submit their own data
    } else if (user?.role === 'parent') {
      return selectedTeenId || 'test-teen-1'; // Parents can select which teen
    }
    return 'test-teen-1'; // Fallback
  };

  const uploadData = async () => {
    if (sensorData.length === 0) return;
    
    const teenId = getTeenId();
    if (!teenId) {
      setSensorError('Please select a teen to associate this data with.');
      return;
    }
    
    setUploading(true);
    try {
      // Convert sensor readings to the expected format
      const formattedData = sensorData.map(reading => ({
        teenId,
        timestamp: reading.timestamp,
        gps: reading.gps,
        accelerometer: reading.accelerometer,
        location: `${reading.gps.latitude.toFixed(4)}, ${reading.gps.longitude.toFixed(4)}`
      }));

      const response = await apiRequest('POST', '/api/smartphone-data/bulk', {
        sensorDataArray: formattedData
      });

      const result = await response.json();
      setViolations(prev => prev + result.totalViolations);
      setLastUpload(new Date());
      setSensorData([]); // Clear uploaded data
      
    } catch (error) {
      console.error('Failed to upload sensor data:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Smartphone Data Simulator</h1>
                <p className="text-gray-600">Simulate real-time sensor data collection for driving behavior analysis</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Data Collection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={isTracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {isTracking ? '● Recording' : 'Stopped'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Points:</span>
                    <span className="font-mono text-sm">{sensorData.length}</span>
                  </div>

                  {/* Teen Selection for Parents */}
                  {user?.role === 'parent' && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Collecting data for:
                      </label>
                      <select 
                        value={selectedTeenId} 
                        onChange={(e) => setSelectedTeenId(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-2 bg-white"
                      >
                        <option value="">Select Teen...</option>
                        <option value="test-teen-1">Test Teen</option>
                      </select>
                    </div>
                  )}

                  {/* Current User Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="text-xs text-blue-700">
                      <strong>Data will be attributed to:</strong><br />
                      {user?.role === 'teen' ? (
                        `${user.firstName} ${user.lastName} (You)`
                      ) : user?.role === 'parent' ? (
                        selectedTeenId ? `Selected teen: ${selectedTeenId}` : 'No teen selected'
                      ) : (
                        'Test Teen (Demo mode)'
                      )}
                    </div>
                  </div>

                  {/* Permission Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location:
                      </span>
                      <Badge variant="outline" className={
                        permissions.location === 'granted' ? 'text-green-700 border-green-300' :
                        permissions.location === 'denied' ? 'text-red-700 border-red-300' :
                        'text-gray-700 border-gray-300'
                      }>
                        {permissions.location === 'granted' ? '✓' : 
                         permissions.location === 'denied' ? '✗' : '?'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Motion:
                      </span>
                      <Badge variant="outline" className={
                        permissions.motion === 'granted' ? 'text-green-700 border-green-300' :
                        permissions.motion === 'denied' ? 'text-red-700 border-red-300' :
                        'text-gray-700 border-gray-300'
                      }>
                        {permissions.motion === 'granted' ? '✓' : 
                         permissions.motion === 'denied' ? '✗' : '?'}
                      </Badge>
                    </div>
                  </div>

                  {sensorError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">{sensorError}</p>
                      </div>
                    </div>
                  )}

                  {permissions.location === 'granted' && permissions.motion === 'denied' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">
                          GPS only mode: Motion sensors unavailable but location tracking works!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {!isTracking ? (
                      <Button onClick={startTracking} className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Start Real Sensor Data
                      </Button>
                    ) : (
                      <Button onClick={stopTracking} variant="outline" className="w-full">
                        Stop Collection
                      </Button>
                    )}
                    
                    <Button 
                      onClick={uploadData} 
                      disabled={sensorData.length === 0 || uploading}
                      className="w-full"
                      variant="secondary"
                    >
                      {uploading ? 'Uploading...' : `Upload ${sensorData.length} Points`}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Upload Status</span>
                    </div>
                    
                    {lastUpload && (
                      <div className="text-xs text-gray-600">
                        Last upload: {lastUpload.toLocaleTimeString()}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Violations Detected:</span>
                      <Badge className={violations > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {violations}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Data Display */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Live Sensor Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sensorData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Current Reading */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Latest Reading</h4>
                        {(() => {
                          const latest = sensorData[sensorData.length - 1];
                          return (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-blue-700 font-medium">GPS (Real Device)</p>
                                <p className="font-mono">Lat: {latest.gps.latitude.toFixed(6)}</p>
                                <p className="font-mono">Lng: {latest.gps.longitude.toFixed(6)}</p>
                                <p className="font-mono">Speed: {((latest.gps.speed || 0) * 2.237).toFixed(1)} mph</p>
                                <p className="font-mono">Accuracy: {latest.gps.accuracy?.toFixed(0)}m</p>
                              </div>
                              <div>
                                <p className="text-blue-700 font-medium">Motion (Real Device)</p>
                                <p className="font-mono">X: {latest.accelerometer.x.toFixed(2)} m/s²</p>
                                <p className="font-mono">Y: {latest.accelerometer.y.toFixed(2)} m/s²</p>
                                <p className="font-mono">Z: {latest.accelerometer.z.toFixed(2)} m/s²</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Data History */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recent Data Points</h4>
                        <div className="max-h-64 overflow-y-auto space-y-1">
                          {sensorData.slice(-10).reverse().map((reading, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-xs font-mono">
                              <div className="flex justify-between items-center">
                                <span>{new Date(reading.timestamp).toLocaleTimeString()}</span>
                                <span className="text-blue-600">
                                  {((reading.gps.speed || 0) * 2.237).toFixed(1)} mph
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start data collection to see live sensor readings</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Uses your device's real GPS and motion sensors for authentic driving data</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Requires location and motion permissions - you'll be prompted to allow access</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Best results when used on a smartphone while actually driving or moving</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>The system will detect real speeding, harsh braking, and aggressive acceleration from your movements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}