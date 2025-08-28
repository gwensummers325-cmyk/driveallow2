import { storage } from './storage';
import { emailService } from './emailService';
import { GeofencingService } from './geofencing';

export interface DrivingData {
  teenId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number; // mph
  speedLimit: number; // mph
  acceleration: number; // m/s²
  location: string;
}

export interface SmartphoneSensorData {
  teenId: string;
  timestamp: string;
  gps: GPSData;
  accelerometer: AccelerometerData;
  gyroscope?: GyroscopeData;
  location?: string;
}

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number; // m/s from GPS
  accuracy?: number;
  heading?: number;
}

export interface AccelerometerData {
  x: number; // lateral acceleration (m/s²)
  y: number; // forward/backward acceleration (m/s²) 
  z: number; // vertical acceleration (m/s²)
  timestamp: number;
}

export interface GyroscopeData {
  x: number; // pitch rate (rad/s)
  y: number; // roll rate (rad/s)
  z: number; // yaw rate (rad/s)
  timestamp: number;
}

export interface ViolationResult {
  type: 'speeding_minor' | 'speeding_major' | 'harsh_braking' | 'aggressive_acceleration';
  severity: 'low' | 'medium' | 'high';
  description: string;
  penaltyAmount: string;
  autoDetected: boolean;
}

export class ViolationDetector {
  // Speed thresholds
  private static MINOR_SPEEDING_THRESHOLD = 2; // mph over limit (3+ mph triggers penalty)
  private static MAJOR_SPEEDING_THRESHOLD = 10; // mph over limit (11+ mph triggers major penalty)
  
  // Acceleration thresholds (m/s²)
  private static HARSH_BRAKING_THRESHOLD = -4.0; // negative acceleration
  private static AGGRESSIVE_ACCEL_THRESHOLD = 3.0; // positive acceleration

  static async processRealTimeData(data: DrivingData): Promise<ViolationResult[]> {
    const violations: ViolationResult[] = [];

    // Get teen's parent ID to fetch allowance settings
    const teen = await storage.getUser(data.teenId);
    if (!teen || !teen.parentId) {
      console.error('Teen or parent not found for violation processing');
      return violations;
    }

    // Fetch teen-specific allowance settings
    const settings = await storage.getAllowanceSettings(teen.parentId, data.teenId);
    if (!settings) {
      console.error('Allowance settings not found for teen');
      return violations;
    }

    // Check for speeding violations with teen-specific settings
    const speedingViolation = await ViolationDetector.checkSpeedingViolation(data, settings);
    if (speedingViolation) {
      violations.push(speedingViolation);
    }

    // Check for aggressive driving violations with teen-specific settings
    const aggressiveViolation = await ViolationDetector.checkAggressiveDriving(data, settings);
    if (aggressiveViolation) {
      violations.push(aggressiveViolation);
    }

    // Process each violation automatically
    for (const violation of violations) {
      await ViolationDetector.processViolation(data.teenId, data, violation);
    }

    return violations;
  }

  private static async checkSpeedingViolation(data: DrivingData, settings: any): Promise<ViolationResult | null> {
    const speedDifference = data.speed - data.speedLimit;
    
    if (speedDifference > this.MAJOR_SPEEDING_THRESHOLD) {
      return {
        type: 'speeding_major',
        severity: 'high',
        description: `Major speeding: ${data.speed}mph in ${data.speedLimit}mph zone (+${speedDifference}mph)`,
        penaltyAmount: settings.speedingMajorPenalty,
        autoDetected: true
      };
    } else if (speedDifference > this.MINOR_SPEEDING_THRESHOLD) {
      return {
        type: 'speeding_minor',
        severity: 'medium',
        description: `Speeding: ${data.speed}mph in ${data.speedLimit}mph zone (+${speedDifference}mph)`,
        penaltyAmount: settings.speedingMinorPenalty,
        autoDetected: true
      };
    }

    return null;
  }

  private static async checkAggressiveDriving(data: DrivingData, settings: any): Promise<ViolationResult | null> {
    // Check harsh braking (negative acceleration)
    if (data.acceleration <= this.HARSH_BRAKING_THRESHOLD) {
      return {
        type: 'harsh_braking',
        severity: 'medium',
        description: `Harsh braking detected (${Math.abs(data.acceleration).toFixed(1)} m/s² deceleration)`,
        penaltyAmount: settings.harshBrakingPenalty,
        autoDetected: true
      };
    }

    // Check aggressive acceleration
    if (data.acceleration >= this.AGGRESSIVE_ACCEL_THRESHOLD) {
      return {
        type: 'aggressive_acceleration',
        severity: 'medium',
        description: `Aggressive acceleration detected (${data.acceleration.toFixed(1)} m/s² acceleration)`,
        penaltyAmount: settings.aggressiveAccelPenalty,
        autoDetected: true
      };
    }

    return null;
  }

  private static async processViolation(teenId: string, data: DrivingData, violation: ViolationResult) {
    try {
      // Get teen and parent information
      const teen = await storage.getUser(teenId);
      if (!teen || !teen.parentId) {
        console.error('Teen or parent not found for violation processing');
        return;
      }

      const parent = await storage.getUser(teen.parentId);
      if (!parent) {
        console.error('Parent not found for violation processing');
        return;
      }

      // Create incident record (auto-reported)
      await storage.createIncident({
        teenId,
        parentId: teen.parentId,
        type: violation.type,
        location: data.location,
        notes: violation.description,
        penaltyAmount: violation.penaltyAmount,
        autoReported: true, // Mark as auto-detected
      });

      // Create penalty transaction
      await storage.createTransaction({
        teenId,
        parentId: teen.parentId,
        type: 'penalty',
        amount: `-${violation.penaltyAmount}`,
        description: `Auto-detected: ${violation.description}`,
        location: data.location,
      });

      // Get balance before deduction
      const currentBalance = await storage.getAllowanceBalance(teenId);
      const balanceBeforeAmount = currentBalance?.currentBalance || '0.00';
      
      // Update balance
      const newBalance = parseFloat(balanceBeforeAmount) - parseFloat(violation.penaltyAmount);
      await storage.upsertAllowanceBalance({
        teenId,
        currentBalance: newBalance.toString(),
      });

      // Send email notifications
      if (teen?.email && parent?.email) {
        await emailService.sendIncidentNotification(
          parent.email,
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          violation.type.replace('_', ' '),
          data.location || 'Unknown location',
          violation.penaltyAmount,
          balanceBeforeAmount,
          newBalance.toFixed(2)
        );
      }

      console.log(`✅ Processed automatic violation for ${teen.firstName}: ${violation.description}`);
    } catch (error) {
      console.error('Error processing violation:', error);
    }
  }

  // Process incoming smartphone sensor data
  static async processSmartphoneData(sensorData: SmartphoneSensorData): Promise<ViolationResult[]> {
    console.log(`📱 Processing smartphone sensor data for teen: ${sensorData.teenId}`);
    
    const violations: ViolationResult[] = [];
    
    try {
      // Get teen's parent ID to fetch allowance settings
      const teen = await storage.getUser(sensorData.teenId);
      if (!teen || !teen.parentId) {
        console.error('Teen or parent not found for smartphone sensor processing');
        return violations;
      }

      // Fetch teen-specific allowance settings
      const settings = await storage.getAllowanceSettings(teen.parentId, sensorData.teenId);
      if (!settings) {
        console.error('Allowance settings not found for teen in smartphone processing');
        return violations;
      }

      // Convert smartphone sensor data to driving data format
      const drivingData: DrivingData = {
        teenId: sensorData.teenId,
        timestamp: sensorData.timestamp,
        latitude: sensorData.gps.latitude,
        longitude: sensorData.gps.longitude,
        speed: this.calculateSpeed(sensorData.gps),
        speedLimit: await this.getSpeedLimit(sensorData.gps.latitude, sensorData.gps.longitude),
        acceleration: this.calculateAcceleration(sensorData.accelerometer),
        location: sensorData.location || await this.reverseGeocode(sensorData.gps.latitude, sensorData.gps.longitude)
      };
      
      // Check for speeding violations with teen-specific settings
      const speedingViolation = await ViolationDetector.checkSpeedingViolation(drivingData, settings);
      if (speedingViolation) {
        violations.push(speedingViolation);
        await ViolationDetector.processViolation(sensorData.teenId, drivingData, speedingViolation);
      }

      // Check for aggressive driving violations with teen-specific settings
      const aggressiveViolation = await ViolationDetector.checkAggressiveDriving(drivingData, settings);
      if (aggressiveViolation) {
        violations.push(aggressiveViolation);
        await ViolationDetector.processViolation(sensorData.teenId, drivingData, aggressiveViolation);
      }

      // Check geofencing violations
      try {
        await GeofencingService.processLocationData(
          sensorData.teenId,
          teen.parentId,
          sensorData.gps.latitude,
          sensorData.gps.longitude,
          undefined, // tripId - not used in smartphone monitoring
          drivingData.location
        );
      } catch (error) {
        console.error('Error checking geofence locations:', error);
      }
      
      // Store driving data for analysis
      await ViolationDetector.storeDrivingData(drivingData);
      
    } catch (error) {
      console.error('Error processing smartphone sensor data:', error);
    }
    
    return violations;
  }

  // Calculate speed from GPS data
  private static calculateSpeed(gps: GPSData): number {
    // GPS speed is typically provided in m/s, convert to mph
    if (gps.speed !== undefined) {
      return Math.round(gps.speed * 2.237); // Convert m/s to mph
    }
    return 0;
  }

  // Calculate acceleration from accelerometer data  
  private static calculateAcceleration(accel: AccelerometerData): number {
    // Calculate forward acceleration magnitude
    // Y-axis typically represents forward/backward motion
    return Math.round(accel.y * 10) / 10;
  }

  // Get speed limit for current location using HERE Maps API
  private static async getSpeedLimit(lat: number, lng: number): Promise<number> {
    try {
      if (!process.env.HERE_MAPS_API_KEY) {
        console.warn('HERE_MAPS_API_KEY not found, using fallback speed limits');
        return ViolationDetector.getFallbackSpeedLimit(lat, lng);
      }

      // HERE Maps Routing API v8 with speed limit spans
      const destination = `${lat + 0.001},${lng + 0.001}`;
      const url = `https://router.hereapi.com/v8/routes?origin=${lat},${lng}&destination=${destination}&return=polyline&transportMode=car&spans=speedLimit&apikey=${process.env.HERE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`HERE Maps API error: ${response.status} - ${errorText}, using fallback`);
        return ViolationDetector.getFallbackSpeedLimit(lat, lng);
      }
      
      const data = await response.json();
      
      // Extract speed limit from spans data
      if (data.routes && data.routes[0] && data.routes[0].spans) {
        const spans = data.routes[0].spans;
        
        // Get the first speed limit from spans
        for (const span of spans) {
          if (span.speedLimit !== undefined) {
            // Speed limit is in m/s, convert to mph
            const speedLimitMph = Math.round(span.speedLimit * 2.237);
            console.log(`📍 HERE Maps speed limit: ${speedLimitMph} mph (${span.speedLimit} m/s) at ${lat}, ${lng}`);
            return speedLimitMph;
          }
        }
      }
      
      // If no speed limit found in API response, use fallback
      console.log(`📍 No speed limit data from HERE Maps for ${lat}, ${lng}, using fallback`);
      return ViolationDetector.getFallbackSpeedLimit(lat, lng);
      
    } catch (error) {
      console.error('Error fetching speed limit from HERE Maps:', error);
      return ViolationDetector.getFallbackSpeedLimit(lat, lng);
    }
  }

  // Fallback speed limit detection when API is unavailable
  private static getFallbackSpeedLimit(lat: number, lng: number): number {
    // Simple heuristic based on location patterns
    const latMod = Math.abs(lat % 0.01);
    const lngMod = Math.abs(lng % 0.01);
    
    // Simulate different area types
    if (latMod < 0.003 && lngMod < 0.003) return 25; // Residential/school zones
    if (latMod < 0.006 && lngMod < 0.006) return 35; // City streets
    if (latMod < 0.008 && lngMod < 0.008) return 45; // Main roads
    return 55; // Highways/major roads
  }

  // Reverse geocode coordinates to address using HERE Maps API
  private static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      if (!process.env.HERE_MAPS_API_KEY) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      // HERE Geocoding API v7 for reverse geocoding
      const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=en-US&apikey=${process.env.HERE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`HERE Geocoding API error: ${response.status}, using coordinates`);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      
      const data = await response.json();
      
      // Extract address from response
      if (data.items && data.items[0] && data.items[0].address) {
        const address = data.items[0].address;
        const street = address.street || '';
        const city = address.city || '';
        const state = address.stateCode || '';
        
        // Build readable address
        let location = '';
        if (street) location += street;
        if (city) location += (location ? ', ' : '') + city;
        if (state) location += (location ? ', ' : '') + state;
        
        if (location) {
          console.log(`📍 HERE Geocoding: ${location} for ${lat}, ${lng}`);
          return location;
        }
      }
      
      // Fallback to coordinates
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
    } catch (error) {
      console.error('Error reverse geocoding with HERE Maps:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  // Store driving data for analysis and trip tracking
  private static async storeDrivingData(data: DrivingData): Promise<void> {
    // Store raw driving data for analysis (would save to database)
    console.log(`📊 Storing driving data: ${data.speed}mph at ${data.location}`);
  }
}