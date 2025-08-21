import { storage } from './storage';

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

export interface ViolationResult {
  type: 'speeding_minor' | 'speeding_major' | 'harsh_braking' | 'aggressive_acceleration';
  severity: 'low' | 'medium' | 'high';
  description: string;
  penaltyAmount: string;
  autoDetected: boolean;
}

export class ViolationDetector {
  // Speed thresholds
  private static MINOR_SPEEDING_THRESHOLD = 7; // mph over limit
  private static MAJOR_SPEEDING_THRESHOLD = 15; // mph over limit
  
  // Acceleration thresholds (m/s²)
  private static HARSH_BRAKING_THRESHOLD = -4.0; // negative acceleration
  private static AGGRESSIVE_ACCEL_THRESHOLD = 3.0; // positive acceleration

  static async processRealTimeData(data: DrivingData): Promise<ViolationResult[]> {
    const violations: ViolationResult[] = [];

    // Check for speeding violations
    const speedingViolation = this.checkSpeedingViolation(data);
    if (speedingViolation) {
      violations.push(speedingViolation);
    }

    // Check for aggressive driving violations
    const aggressiveViolation = this.checkAggressiveDriving(data);
    if (aggressiveViolation) {
      violations.push(aggressiveViolation);
    }

    // Process each violation automatically
    for (const violation of violations) {
      await this.processViolation(data.teenId, data, violation);
    }

    return violations;
  }

  private static checkSpeedingViolation(data: DrivingData): ViolationResult | null {
    const speedDifference = data.speed - data.speedLimit;
    
    if (speedDifference > this.MAJOR_SPEEDING_THRESHOLD) {
      return {
        type: 'speeding_major',
        severity: 'high',
        description: `Major speeding: ${data.speed}mph in ${data.speedLimit}mph zone (+${speedDifference}mph)`,
        penaltyAmount: '10.00',
        autoDetected: true
      };
    } else if (speedDifference > this.MINOR_SPEEDING_THRESHOLD) {
      return {
        type: 'speeding_minor',
        severity: 'medium',
        description: `Speeding: ${data.speed}mph in ${data.speedLimit}mph zone (+${speedDifference}mph)`,
        penaltyAmount: '5.00',
        autoDetected: true
      };
    }

    return null;
  }

  private static checkAggressiveDriving(data: DrivingData): ViolationResult | null {
    // Check harsh braking (negative acceleration)
    if (data.acceleration <= this.HARSH_BRAKING_THRESHOLD) {
      return {
        type: 'harsh_braking',
        severity: 'medium',
        description: `Harsh braking detected (${Math.abs(data.acceleration).toFixed(1)} m/s² deceleration)`,
        penaltyAmount: '3.00',
        autoDetected: true
      };
    }

    // Check aggressive acceleration
    if (data.acceleration >= this.AGGRESSIVE_ACCEL_THRESHOLD) {
      return {
        type: 'aggressive_acceleration',
        severity: 'medium',
        description: `Aggressive acceleration detected (${data.acceleration.toFixed(1)} m/s² acceleration)`,
        penaltyAmount: '3.00',
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

      // Create incident record
      await storage.createIncident({
        teenId,
        parentId: teen.parentId,
        type: violation.type,
        location: data.location,
        notes: violation.description,
        penaltyAmount: violation.penaltyAmount,
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

      // Update balance
      const currentBalance = await storage.getAllowanceBalance(teenId);
      const newBalance = parseFloat(currentBalance?.currentBalance || '0.00') - parseFloat(violation.penaltyAmount);
      
      await storage.upsertAllowanceBalance({
        teenId,
        currentBalance: newBalance.toString(),
      });

      // TODO: Send email notifications would be implemented here
      // This would use the email service to notify parents and teens

      console.log(`✅ Processed automatic violation for ${teen.firstName}: ${violation.description}`);
    } catch (error) {
      console.error('Error processing violation:', error);
    }
  }

  // Simulate continuous monitoring for demo purposes
  static startContinuousMonitoring() {
    console.log('🚗 Starting automated driving behavior monitoring...');
    
    setInterval(async () => {
      try {
        // For demonstration purposes, we'll simulate some driving data
        // In a real app, this would receive data from mobile apps
        const knownTeenIds = ['test-teen-1']; // Hardcode for demo
        
        for (const teenId of knownTeenIds) {
          // 2% chance per check of generating driving data
          if (Math.random() > 0.98) {
            const simulatedData = this.generateSimulatedDrivingData(teenId);
            console.log(`🚗 Simulating driving data for teen: ${teenId}`);
            await this.processRealTimeData(simulatedData);
          }
        }
      } catch (error) {
        console.error('Error in continuous monitoring:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  // Generate simulated driving data for demonstration
  private static generateSimulatedDrivingData(teenId: string): DrivingData {
    const locations = ['Main Street', 'Highway 101', 'Oak Avenue', 'School Zone', 'Residential Area'];
    const speedLimits = [25, 35, 45, 55, 65];
    
    const baseSpeedLimit = speedLimits[Math.floor(Math.random() * speedLimits.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate realistic driving scenarios
    const scenarios = [
      // Normal driving (most common)
      { speed: baseSpeedLimit + Math.random() * 5, acceleration: Math.random() * 1 - 0.5 },
      // Minor speeding  
      { speed: baseSpeedLimit + 8 + Math.random() * 5, acceleration: Math.random() * 2 },
      // Major speeding (rare)
      { speed: baseSpeedLimit + 17 + Math.random() * 8, acceleration: Math.random() * 2 },
      // Harsh braking
      { speed: baseSpeedLimit + Math.random() * 5, acceleration: -5 - Math.random() * 2 },
      // Aggressive acceleration
      { speed: baseSpeedLimit + Math.random() * 10, acceleration: 3.5 + Math.random() * 2 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    return {
      teenId,
      timestamp: new Date().toISOString(),
      latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
      speed: Math.round(scenario.speed),
      speedLimit: baseSpeedLimit,
      acceleration: Math.round(scenario.acceleration * 10) / 10,
      location
    };
  }
}