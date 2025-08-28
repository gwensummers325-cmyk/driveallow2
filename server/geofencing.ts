import { db } from "./db";
import { geofences, geofenceEvents, monitoringAlerts, transactions } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { storage } from "./storage";
import { emailService } from "./emailService";
import type { 
  Geofence, 
  InsertGeofence, 
  InsertGeofenceEvent, 
  InsertMonitoringAlert,
  InsertTransaction 
} from "@shared/schema";

export class GeofencingService {
  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Check if a location is within a geofence
   */
  private static isInsideGeofence(
    latitude: number, 
    longitude: number, 
    geofence: Geofence
  ): boolean {
    const distance = this.calculateDistance(
      latitude, 
      longitude, 
      parseFloat(geofence.latitude), 
      parseFloat(geofence.longitude)
    );
    return distance <= geofence.radius;
  }

  /**
   * Check if current time matches geofence time restrictions
   */
  private static isWithinTimeRestrictions(geofence: Geofence): boolean {
    if (!geofence.startTime || !geofence.endTime) {
      return true; // No time restrictions
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // 'mon', 'tue', etc.
    
    // Check if today is in allowed days
    if (geofence.daysOfWeek && geofence.daysOfWeek.length > 0) {
      const shortDays = geofence.daysOfWeek.map(day => day.substring(0, 3).toLowerCase());
      if (!shortDays.includes(currentDay)) {
        return false;
      }
    }

    // Check time range
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
    const startTime = parseInt(geofence.startTime.replace(':', ''));
    const endTime = parseInt(geofence.endTime.replace(':', ''));

    if (startTime <= endTime) {
      // Same day range (e.g., 09:00 to 17:00)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight range (e.g., 22:00 to 06:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Get active geofences for a parent
   */
  static async getActiveGeofences(parentId: string): Promise<Geofence[]> {
    return await db
      .select()
      .from(geofences)
      .where(and(
        eq(geofences.parentId, parentId),
        eq(geofences.isActive, true)
      ));
  }

  /**
   * Create a new geofence
   */
  static async createGeofence(geofenceData: InsertGeofence): Promise<Geofence> {
    const [newGeofence] = await db
      .insert(geofences)
      .values(geofenceData)
      .returning();
    return newGeofence;
  }

  /**
   * Update an existing geofence
   */
  static async updateGeofence(id: string, updates: Partial<InsertGeofence>): Promise<Geofence | null> {
    const [updatedGeofence] = await db
      .update(geofences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(geofences.id, id))
      .returning();
    return updatedGeofence || null;
  }

  /**
   * Delete a geofence
   */
  static async deleteGeofence(id: string): Promise<boolean> {
    const result = await db
      .delete(geofences)
      .where(eq(geofences.id, id));
    return (result.rowCount || 0) > 0;
  }

  /**
   * Process location data and check for geofence events
   */
  static async processLocationData(
    teenId: string,
    parentId: string,
    latitude: number,
    longitude: number,
    tripId?: string,
    address?: string
  ): Promise<void> {
    // Get all active geofences for this parent
    const activeGeofences = await this.getActiveGeofences(parentId);
    
    if (activeGeofences.length === 0) {
      return; // No geofences to check
    }

    // Get recent geofence events to determine current state
    const recentEvents = await db
      .select()
      .from(geofenceEvents)
      .where(and(
        eq(geofenceEvents.teenId, teenId),
        eq(geofenceEvents.parentId, parentId)
      ))
      .orderBy(desc(geofenceEvents.createdAt))
      .limit(50);

    // Track current zones (zones the teen is currently in)
    const currentZones = new Set<string>();
    
    for (const geofence of activeGeofences) {
      const isInside = this.isInsideGeofence(latitude, longitude, geofence);
      const withinTimeRestrictions = this.isWithinTimeRestrictions(geofence);
      
      // Find the last event for this geofence
      const lastEvent = recentEvents
        .filter(event => event.geofenceId === geofence.id)
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        })[0];
      
      const wasInside = lastEvent?.action === 'enter';
      
      if (isInside && !wasInside) {
        // Teen entered the geofence
        currentZones.add(geofence.id);
        await this.handleGeofenceEntry(geofence, teenId, parentId, latitude, longitude, tripId, address, withinTimeRestrictions);
      } else if (!isInside && wasInside) {
        // Teen exited the geofence
        await this.handleGeofenceExit(geofence, teenId, parentId, latitude, longitude, tripId, address);
      } else if (isInside) {
        // Teen is still inside
        currentZones.add(geofence.id);
        
        // Check for violations if it's a restricted or curfew zone
        if ((geofence.type === 'restricted' || (geofence.type === 'curfew' && !withinTimeRestrictions)) && withinTimeRestrictions !== null) {
          await this.handleGeofenceViolation(geofence, teenId, parentId, latitude, longitude, tripId, address);
        }
      }
    }
  }

  /**
   * Handle geofence entry event
   */
  private static async handleGeofenceEntry(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    latitude: number,
    longitude: number,
    tripId?: string,
    address?: string,
    withinTimeRestrictions?: boolean
  ): Promise<void> {
    console.log(`🏁 Teen ${teenId} entered geofence: ${geofence.name}`);

    // Create geofence event
    const eventData: InsertGeofenceEvent = {
      geofenceId: geofence.id,
      teenId,
      parentId,
      action: 'enter',
      tripId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address
    };

    const [event] = await db.insert(geofenceEvents).values(eventData).returning();

    // Handle different geofence types
    if (geofence.type === 'safe_zone' && geofence.allowanceBonus && parseFloat(geofence.allowanceBonus) > 0) {
      // Award bonus for entering safe zone
      await this.awardAllowanceBonus(geofence, teenId, parentId, event.id);
    }

    if (geofence.type === 'restricted') {
      // Create violation for entering restricted zone
      await this.createViolationAlert(geofence, teenId, parentId, event.id, 'enter');
      
      if (geofence.penaltyAmount && parseFloat(geofence.penaltyAmount) > 0) {
        await this.applyPenalty(geofence, teenId, parentId, event.id, 'enter');
      }
    }

    if (geofence.type === 'curfew' && !withinTimeRestrictions) {
      // Create violation for entering during curfew hours
      await this.createViolationAlert(geofence, teenId, parentId, event.id, 'enter');
      
      if (geofence.penaltyAmount && parseFloat(geofence.penaltyAmount) > 0) {
        await this.applyPenalty(geofence, teenId, parentId, event.id, 'enter');
      }
    }

    // Send notification if enabled
    if (geofence.notifyOnEntry) {
      await this.createGeofenceAlert(geofence, teenId, parentId, event.id, 'enter');
    }
  }

  /**
   * Handle geofence exit event
   */
  private static async handleGeofenceExit(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    latitude: number,
    longitude: number,
    tripId?: string,
    address?: string
  ): Promise<void> {
    console.log(`🏁 Teen ${teenId} exited geofence: ${geofence.name}`);

    // Create geofence event
    const eventData: InsertGeofenceEvent = {
      geofenceId: geofence.id,
      teenId,
      parentId,
      action: 'exit',
      tripId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address
    };

    const [event] = await db.insert(geofenceEvents).values(eventData).returning();

    // Send notification if enabled
    if (geofence.notifyOnExit) {
      await this.createGeofenceAlert(geofence, teenId, parentId, event.id, 'exit');
    }
  }

  /**
   * Handle geofence violation
   */
  private static async handleGeofenceViolation(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    latitude: number,
    longitude: number,
    tripId?: string,
    address?: string
  ): Promise<void> {
    // Create violation event
    const eventData: InsertGeofenceEvent = {
      geofenceId: geofence.id,
      teenId,
      parentId,
      action: 'violation',
      tripId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address
    };

    const [event] = await db.insert(geofenceEvents).values(eventData).returning();

    await this.createViolationAlert(geofence, teenId, parentId, event.id, 'violation');
    
    if (geofence.penaltyAmount && parseFloat(geofence.penaltyAmount) > 0) {
      await this.applyPenalty(geofence, teenId, parentId, event.id, 'violation');
    }
  }

  /**
   * Award allowance bonus for safe zone
   */
  private static async awardAllowanceBonus(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    eventId: string
  ): Promise<void> {
    const transactionData: InsertTransaction = {
      teenId,
      parentId,
      type: 'bonus',
      amount: geofence.allowanceBonus!,
      description: `Safe zone bonus: ${geofence.name}`,
      location: geofence.address || `${geofence.name} zone`,
      notes: `Awarded for entering safe zone: ${geofence.name}`
    };

    const [transaction] = await db.insert(transactions).values(transactionData).returning();

    // Update the geofence event with transaction reference
    await db
      .update(geofenceEvents)
      .set({ transactionId: transaction.id })
      .where(eq(geofenceEvents.id, eventId));

    console.log(`💰 Awarded ${geofence.allowanceBonus} bonus to teen ${teenId} for entering ${geofence.name}`);
  }

  /**
   * Apply penalty for restricted zone or violation
   */
  private static async applyPenalty(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    eventId: string,
    action: 'enter' | 'violation'
  ): Promise<void> {
    const transactionData: InsertTransaction = {
      teenId,
      parentId,
      type: 'penalty',
      amount: `-${geofence.penaltyAmount!}`,
      description: `Geofence violation: ${geofence.name}`,
      location: geofence.address || `${geofence.name} zone`,
      notes: action === 'enter' 
        ? `Penalty for entering restricted zone: ${geofence.name}`
        : `Penalty for violating zone rules: ${geofence.name}`
    };

    const [transaction] = await db.insert(transactions).values(transactionData).returning();

    // Update the geofence event with transaction reference
    await db
      .update(geofenceEvents)
      .set({ transactionId: transaction.id })
      .where(eq(geofenceEvents.id, eventId));

    // Get balance information for email notification
    const balanceBefore = await storage.getAllowanceBalance(teenId);
    const balanceBeforeAmount = balanceBefore?.currentBalance || '0.00';
    
    // Update balance (deduct penalty)
    await storage.updateBalance(teenId, geofence.penaltyAmount!, true);
    
    // Get balance after deduction
    const balanceAfter = await storage.getAllowanceBalance(teenId);
    const balanceAfterAmount = balanceAfter?.currentBalance || '0.00';

    // Send email notification for geofence violation
    try {
      const teen = await storage.getUser(teenId);
      const parent = await storage.getUser(parentId);
      
      if (teen?.email && parent?.email) {
        const incidentType = geofence.type === 'restricted' 
          ? 'Restricted area violation'
          : geofence.type === 'curfew'
          ? 'Curfew violation'
          : 'Geofence violation';
        
        await emailService.sendIncidentNotification(
          parent.email,
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          incidentType,
          geofence.address || `${geofence.name} zone`,
          geofence.penaltyAmount!,
          balanceBeforeAmount,
          balanceAfterAmount
        );
        
        console.log(`📧 Sent geofence violation email for ${geofence.name} to parent and teen`);
      }
    } catch (error) {
      console.error('Failed to send geofence violation email:', error);
    }

    console.log(`💸 Applied ${geofence.penaltyAmount} penalty to teen ${teenId} for ${geofence.name} violation`);
  }

  /**
   * Create monitoring alert for geofence event
   */
  private static async createGeofenceAlert(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    eventId: string,
    action: 'enter' | 'exit'
  ): Promise<void> {
    const message = action === 'enter'
      ? `Teen entered ${geofence.name}`
      : `Teen exited ${geofence.name}`;

    const severity = geofence.type === 'restricted' || geofence.type === 'curfew' ? 'high' : 'low';

    const alertData: InsertMonitoringAlert = {
      teenId,
      parentId,
      type: 'geofence',
      message,
      severity
    };

    const [alert] = await db.insert(monitoringAlerts).values(alertData).returning();

    // Update the geofence event with alert reference
    await db
      .update(geofenceEvents)
      .set({ alertId: alert.id })
      .where(eq(geofenceEvents.id, eventId));
  }

  /**
   * Create violation alert
   */
  private static async createViolationAlert(
    geofence: Geofence,
    teenId: string,
    parentId: string,
    eventId: string,
    action: 'enter' | 'violation'
  ): Promise<void> {
    const message = action === 'enter'
      ? `⚠️ Teen entered restricted area: ${geofence.name}`
      : `⚠️ Teen violating zone rules: ${geofence.name}`;

    const alertData: InsertMonitoringAlert = {
      teenId,
      parentId,
      type: 'geofence',
      message,
      severity: 'high'
    };

    const [alert] = await db.insert(monitoringAlerts).values(alertData).returning();

    // Update the geofence event with alert reference
    await db
      .update(geofenceEvents)
      .set({ alertId: alert.id })
      .where(eq(geofenceEvents.id, eventId));
  }

  /**
   * Get geofence events for a teen
   */
  static async getGeofenceEvents(teenId: string, parentId: string, limit = 50): Promise<any[]> {
    return await db
      .select({
        id: geofenceEvents.id,
        action: geofenceEvents.action,
        createdAt: geofenceEvents.createdAt,
        latitude: geofenceEvents.latitude,
        longitude: geofenceEvents.longitude,
        address: geofenceEvents.address,
        geofence: {
          id: geofences.id,
          name: geofences.name,
          type: geofences.type,
          address: geofences.address
        }
      })
      .from(geofenceEvents)
      .leftJoin(geofences, eq(geofenceEvents.geofenceId, geofences.id))
      .where(and(
        eq(geofenceEvents.teenId, teenId),
        eq(geofenceEvents.parentId, parentId)
      ))
      .orderBy(desc(geofenceEvents.createdAt))
      .limit(limit);
  }
}