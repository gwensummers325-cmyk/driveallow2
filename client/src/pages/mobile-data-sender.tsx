import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, MapPin, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
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

export default function MobileDataSender() {
  const [isTracking, setIsTracking] = useState(false);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [lastUpload, setLastUpload] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);
  const [violations, setViolations] = useState(0);

  // Simulate getting device sensor data
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        // Simulate realistic sensor data
        const reading: SensorReading = {
          timestamp: new Date().toISOString(),
          gps: {
            latitude: 37.7749 + (Math.random() - 0.5) * 0.001,
            longitude: -122.4194 + (Math.random() - 0.5) * 0.001,
            speed: 15 + Math.random() * 25, // m/s (simulated driving speeds)
            accuracy: Math.random() * 10 + 3
          },
          accelerometer: {
            x: (Math.random() - 0.5) * 2, // lateral
            y: (Math.random() - 0.5) * 4, // forward/back  
            z: 9.8 + (Math.random() - 0.5) * 0.5, // gravity + vibration
            timestamp: Date.now()
          }
        };
        
        setSensorData(prev => [...prev.slice(-99), reading]); // Keep last 100 readings
      }, 1000); // Collect data every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setSensorData([]);
    setViolations(0);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const uploadData = async () => {
    if (sensorData.length === 0) return;
    
    setUploading(true);
    try {
      // Convert sensor readings to the expected format
      const formattedData = sensorData.map(reading => ({
        teenId: 'test-teen-1', // In real app, this would come from auth
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

                  <div className="space-y-2">
                    {!isTracking ? (
                      <Button onClick={startTracking} className="w-full">
                        Start Collecting Data
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
                                <p className="text-blue-700 font-medium">GPS</p>
                                <p className="font-mono">Lat: {latest.gps.latitude.toFixed(6)}</p>
                                <p className="font-mono">Lng: {latest.gps.longitude.toFixed(6)}</p>
                                <p className="font-mono">Speed: {((latest.gps.speed || 0) * 2.237).toFixed(1)} mph</p>
                              </div>
                              <div>
                                <p className="text-blue-700 font-medium">Accelerometer</p>
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
                      <p>Click "Start Collecting Data" to simulate smartphone sensors collecting GPS and accelerometer data</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Data is collected every second and stored locally until uploaded</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Upload data to the server for automated violation detection and analysis</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>The system will automatically detect speeding, harsh braking, and aggressive acceleration</p>
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