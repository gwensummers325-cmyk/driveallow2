/**
 * Phone Usage Monitoring System for Teen Drivers
 * Detects phone interactions during driving and reports violations
 * Includes automatic driving session detection using GPS and motion sensors
 */

interface PhoneUsageEvent {
  type: 'screen_interaction' | 'app_switch' | 'text_input' | 'call_answered';
  timestamp: Date;
  duration: number; // seconds
  appName?: string;
  details?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  speed: number | null; // m/s
  timestamp: number;
  accuracy: number;
}

class PhoneUsageMonitor {
  private isDriving: boolean = false;
  private isMonitoringActive: boolean = false;
  private violations: PhoneUsageEvent[] = [];
  private lastInteractionTime: number = 0;
  private interactionStartTime: number = 0;
  private currentTripId: string | null = null;
  private watchPosition: number | null = null;
  private locationHistory: LocationData[] = [];
  private speedReadings: number[] = [];
  private drivingConfidenceScore: number = 0;

  // Thresholds for violations and driving detection
  private readonly INTERACTION_TIMEOUT = 2000; // 2 seconds
  private readonly VIOLATION_THRESHOLD = 1000; // 1 second of interaction = violation
  private readonly DRIVING_SPEED_THRESHOLD = 6.7; // 15 mph in m/s
  private readonly WALKING_SPEED_THRESHOLD = 2.2; // 5 mph in m/s  
  private readonly CONFIDENCE_THRESHOLD = 0.7; // 70% confidence to start monitoring
  private readonly LOCATION_HISTORY_SIZE = 10;
  private readonly SPEED_HISTORY_SIZE = 5;

  constructor() {
    this.setupEventListeners();
    this.startLocationMonitoring();
  }

  private startLocationMonitoring() {
    if (navigator.geolocation) {
      // Request high accuracy location updates
      this.watchPosition = navigator.geolocation.watchPosition(
        this.handleLocationUpdate.bind(this),
        this.handleLocationError.bind(this),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      );
      console.log('📍 GPS location monitoring started');
    } else {
      console.error('❌ Geolocation not supported');
    }
  }

  private handleLocationUpdate(position: GeolocationPosition) {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed, // m/s or null
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy
    };

    this.locationHistory.push(locationData);
    if (this.locationHistory.length > this.LOCATION_HISTORY_SIZE) {
      this.locationHistory.shift();
    }

    this.analyzeDrivingBehavior(locationData);
  }

  private handleLocationError(error: GeolocationPositionError) {
    console.error('📍 Location error:', error.message);
  }

  private analyzeDrivingBehavior(location: LocationData) {
    let speed = location.speed;
    
    // Calculate speed from position changes if GPS speed unavailable
    if (speed === null && this.locationHistory.length >= 2) {
      const prev = this.locationHistory[this.locationHistory.length - 2];
      const distance = this.calculateDistance(
        prev.latitude, prev.longitude,
        location.latitude, location.longitude
      );
      const timeElapsed = (location.timestamp - prev.timestamp) / 1000; // seconds
      speed = distance / timeElapsed; // m/s
    }

    if (speed !== null) {
      this.speedReadings.push(speed);
      if (this.speedReadings.length > this.SPEED_HISTORY_SIZE) {
        this.speedReadings.shift();
      }

      // Calculate driving confidence based on speed patterns
      this.updateDrivingConfidence();
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private updateDrivingConfidence() {
    if (this.speedReadings.length < 3) return;

    const avgSpeed = this.speedReadings.reduce((a, b) => a + b, 0) / this.speedReadings.length;
    const maxSpeed = Math.max(...this.speedReadings);
    const minSpeed = Math.min(...this.speedReadings);
    const speedVariance = maxSpeed - minSpeed;

    let confidence = 0;

    // High confidence if sustained driving speeds
    if (avgSpeed > this.DRIVING_SPEED_THRESHOLD) {
      confidence += 0.6;
    }

    // Additional confidence for speed variations (acceleration/deceleration)
    if (speedVariance > 2.0 && avgSpeed > this.WALKING_SPEED_THRESHOLD) {
      confidence += 0.3;
    }

    // Reduce confidence for walking/stationary speeds
    if (avgSpeed < this.WALKING_SPEED_THRESHOLD) {
      confidence = Math.max(0, confidence - 0.4);
    }

    this.drivingConfidenceScore = Math.max(0, Math.min(1, confidence));

    // Auto-start monitoring if high confidence driving detected
    if (!this.isDriving && this.drivingConfidenceScore > this.CONFIDENCE_THRESHOLD) {
      this.autoStartDriving();
    }
    
    // Auto-stop monitoring if confidence drops (stopped driving)
    if (this.isDriving && this.drivingConfidenceScore < 0.3 && avgSpeed < this.WALKING_SPEED_THRESHOLD) {
      this.autoStopDriving();
    }
  }

  private autoStartDriving() {
    if (this.isDriving) return;
    
    const tripId = `auto-trip-${Date.now()}`;
    this.isDriving = true;
    this.isMonitoringActive = true;
    this.currentTripId = tripId;
    this.violations = [];
    
    console.log('🚗 Automatic driving session started:', tripId);
    console.log('📊 Driving confidence:', (this.drivingConfidenceScore * 100).toFixed(1) + '%');
    
    // Notify user
    this.showNotification('🚗 Driving Detected', 'Phone usage monitoring is now active');
  }

  private autoStopDriving() {
    if (!this.isDriving) return;
    
    console.log('🏁 Automatic driving session ended');
    console.log('📊 Final violations:', this.violations.length);
    
    // Notify user with results
    if (this.violations.length > 0) {
      this.showNotification(
        '⚠️ Driving Session Complete', 
        `${this.violations.length} phone usage violations detected`
      );
    } else {
      this.showNotification('✅ Driving Session Complete', 'No phone violations - great job!');
    }
    
    const violations = this.violations;
    this.isDriving = false;
    this.isMonitoringActive = false;
    this.currentTripId = null;
    
    return violations;
  }

  private showNotification(title: string, message: string) {
    // Try to show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
    
    // Also dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('drivingStatusChange', {
      detail: { title, message, isDriving: this.isDriving }
    }));
  }

  // Manual control methods (for testing or emergency override)
  manualStartMonitoring(tripId: string) {
    this.isDriving = true;
    this.isMonitoringActive = true;
    this.currentTripId = tripId;
    this.violations = [];
    console.log('📱 Manual phone usage monitoring started for trip:', tripId);
  }

  manualStopMonitoring() {
    this.isDriving = false;
    this.isMonitoringActive = false;
    this.currentTripId = null;
    console.log('📱 Manual phone usage monitoring stopped');
    return this.violations;
  }

  private setupEventListeners() {
    // Page Visibility API - Detect when app loses focus
    document.addEventListener('visibilitychange', () => {
      if (this.isMonitoringActive && this.isDriving) {
        if (document.hidden) {
          this.handleAppSwitch();
        } else {
          this.handleAppReturn();
        }
      }
    });

    // Focus events - Detect when browser loses/gains focus
    window.addEventListener('blur', () => {
      if (this.isMonitoringActive && this.isDriving) {
        this.handleAppSwitch();
      }
    });

    window.addEventListener('focus', () => {
      if (this.isMonitoringActive && this.isDriving) {
        this.handleAppReturn();
      }
    });

    // Touch and click events - Detect screen interactions
    ['touchstart', 'click', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        if (this.isMonitoringActive && this.isDriving) {
          this.handleScreenInteraction(e);
        }
      });
    });

    // Text input detection
    document.addEventListener('input', (e) => {
      if (this.isMonitoringActive && this.isDriving) {
        this.handleTextInput(e);
      }
    });
  }

  private handleScreenInteraction(event: Event) {
    const now = Date.now();
    
    if (this.interactionStartTime === 0) {
      this.interactionStartTime = now;
    }
    
    this.lastInteractionTime = now;
    
    // Check if this constitutes a violation (sustained interaction)
    setTimeout(() => {
      if (this.lastInteractionTime === now) {
        // No new interactions, calculate duration
        const duration = (now - this.interactionStartTime) / 1000;
        if (duration >= this.VIOLATION_THRESHOLD / 1000) {
          this.recordViolation('screen_interaction', duration);
        }
        this.interactionStartTime = 0;
      }
    }, this.INTERACTION_TIMEOUT);
  }

  private handleAppSwitch() {
    const now = Date.now();
    this.interactionStartTime = now;
    
    // Record app switch immediately as a violation
    this.recordViolation('app_switch', 1, 'Switched away from DriveAllow app');
  }

  private handleAppReturn() {
    if (this.interactionStartTime > 0) {
      const duration = (Date.now() - this.interactionStartTime) / 1000;
      // App switch duration recorded
      this.interactionStartTime = 0;
    }
  }

  private handleTextInput(event: Event) {
    // Any text input while driving is a violation
    this.recordViolation('text_input', 1, 'Text input detected while driving');
  }

  private recordViolation(type: PhoneUsageEvent['type'], duration: number, details?: string) {
    const violation: PhoneUsageEvent = {
      type,
      timestamp: new Date(),
      duration: Math.round(duration),
      details
    };

    this.violations.push(violation);
    
    console.log('📱 Phone usage violation recorded:', violation);
    
    // Report violation immediately
    this.reportViolation(violation);
  }

  private async reportViolation(violation: PhoneUsageEvent) {
    if (!this.currentTripId) return;

    try {
      // First check if phone usage alerts are enabled for this user's subscription
      const subscriptionResponse = await fetch('/api/subscription', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (subscriptionResponse.ok) {
        const subscription = await subscriptionResponse.json();
        
        // Only report phone violations for Safety Plus subscribers or if phone usage alerts are enabled
        if (!subscription.phoneUsageAlertsEnabled) {
          console.log('📱 Phone usage monitoring disabled for current subscription tier (Safety First)');
          return;
        }
      } else {
        console.log('📱 Could not verify subscription tier, skipping phone violation report');
        return;
      }

      const response = await fetch('/api/phone-violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: this.currentTripId,
          type: violation.type,
          duration: violation.duration,
          timestamp: violation.timestamp.toISOString(),
          details: violation.details,
        }),
      });

      if (response.ok) {
        console.log('📱 Phone violation reported successfully');
      } else {
        console.error('❌ Failed to report phone violation');
      }
    } catch (error) {
      console.error('❌ Error reporting phone violation:', error);
    }
  }

  // Public method to check current monitoring status
  getStatus() {
    const avgSpeed = this.speedReadings.length > 0 
      ? this.speedReadings.reduce((a, b) => a + b, 0) / this.speedReadings.length 
      : 0;
    
    return {
      isDriving: this.isDriving,
      isMonitoring: this.isMonitoringActive,
      violationsCount: this.violations.length,
      currentTripId: this.currentTripId,
      drivingConfidence: this.drivingConfidenceScore,
      currentSpeed: avgSpeed,
      speedMph: avgSpeed * 2.237, // Convert m/s to mph
      isAutoDetected: this.currentTripId?.startsWith('auto-trip-') || false
    };
  }

  // Request notification permission
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  // Clean up resources
  destroy() {
    if (this.watchPosition !== null) {
      navigator.geolocation.clearWatch(this.watchPosition);
    }
  }

  // Get all violations for current trip
  getViolations() {
    return [...this.violations];
  }
}

// Singleton instance
export const phoneMonitor = new PhoneUsageMonitor();

// Request notification permission on load
if (typeof window !== 'undefined') {
  phoneMonitor.requestNotificationPermission();
}

// Export types for use elsewhere
export type { PhoneUsageEvent, LocationData };