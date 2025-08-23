/**
 * Phone Usage Monitoring System for Teen Drivers
 * Detects phone interactions during driving and reports violations
 */

interface PhoneUsageEvent {
  type: 'screen_interaction' | 'app_switch' | 'text_input' | 'call_answered';
  timestamp: Date;
  duration: number; // seconds
  appName?: string;
  details?: string;
}

class PhoneUsageMonitor {
  private isDriving: boolean = false;
  private isMonitoringActive: boolean = false;
  private violations: PhoneUsageEvent[] = [];
  private lastInteractionTime: number = 0;
  private interactionStartTime: number = 0;
  private currentTripId: string | null = null;

  // Thresholds for violations
  private readonly INTERACTION_TIMEOUT = 2000; // 2 seconds
  private readonly VIOLATION_THRESHOLD = 1000; // 1 second of interaction = violation

  constructor() {
    this.setupEventListeners();
  }

  startMonitoring(tripId: string) {
    this.isDriving = true;
    this.isMonitoringActive = true;
    this.currentTripId = tripId;
    this.violations = [];
    console.log('📱 Phone usage monitoring started for trip:', tripId);
  }

  stopMonitoring() {
    this.isDriving = false;
    this.isMonitoringActive = false;
    this.currentTripId = null;
    console.log('📱 Phone usage monitoring stopped');
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
    return {
      isDriving: this.isDriving,
      isMonitoring: this.isMonitoringActive,
      violationsCount: this.violations.length,
      currentTripId: this.currentTripId
    };
  }

  // Get all violations for current trip
  getViolations() {
    return [...this.violations];
  }
}

// Singleton instance
export const phoneMonitor = new PhoneUsageMonitor();

// Export types for use elsewhere
export type { PhoneUsageEvent };