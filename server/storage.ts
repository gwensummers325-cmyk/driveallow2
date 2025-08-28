import {
  users,
  allowanceSettings,
  transactions,
  incidents,
  allowanceBalances,
  subscriptions,
  geofences,
  geofenceEvents,
  type User,
  type UpsertUser,
  type AllowanceSettings,
  type InsertAllowanceSettings,
  type Transaction,
  type InsertTransaction,
  type Incident,
  type InsertIncident,
  type AllowanceBalance,
  type InsertAllowanceBalance,
  type Subscription,
  type InsertSubscription,
  type Geofence,
  type InsertGeofence,
  type GeofenceEvent,
  type InsertGeofenceEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByParentId(parentId: string): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
  updateUserStripeInfo(userId: string, stripeInfo: Partial<Pick<User, 'stripeCustomerId' | 'stripeCardholderId' | 'stripeCardId' | 'cardStatus'>>): Promise<User>;
  
  // Allowance settings operations
  getAllowanceSettings(parentId: string, teenId: string): Promise<AllowanceSettings | undefined>;
  upsertAllowanceSettings(settings: InsertAllowanceSettings): Promise<AllowanceSettings>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByTeenId(teenId: string, limit?: number): Promise<Transaction[]>;
  getTransactionsByParentId(parentId: string, limit?: number): Promise<Transaction[]>;
  
  // Incident operations
  createIncident(incident: InsertIncident): Promise<Incident>;
  getIncidentsByTeenId(teenId: string, limit?: number): Promise<Incident[]>;
  getIncidentsByDateRange(teenId: string, startDate: Date, endDate: Date): Promise<Incident[]>;
  
  // Allowance balance operations
  getAllowanceBalance(teenId: string): Promise<AllowanceBalance | undefined>;
  upsertAllowanceBalance(balance: InsertAllowanceBalance): Promise<AllowanceBalance>;
  updateBalance(teenId: string, amount: string): Promise<AllowanceBalance>;
  
  // Subscription operations
  getSubscription(parentId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(parentId: string, updates: Partial<InsertSubscription>): Promise<Subscription>;
  getTeenCountForParent(parentId: string): Promise<number>;
  calculateSubscriptionPrice(tier: 'safety_first' | 'safety_plus' | 'driveallow_pro' | 'driveallow_pro_yearly', teenCount: number): { basePrice: string; additionalPrice: string; totalPrice: string };
  calculateProratedAmount(tier: 'safety_first' | 'safety_plus' | 'driveallow_pro', currentPeriodStart: Date, currentPeriodEnd: Date): string;
  
  // Geofence operations
  getGeofences(parentId: string): Promise<Geofence[]>;
  createGeofence(geofence: InsertGeofence): Promise<Geofence>;
  updateGeofence(id: string, updates: Partial<InsertGeofence>): Promise<Geofence | undefined>;
  deleteGeofence(id: string): Promise<boolean>;
  getGeofenceEvents(teenId: string, parentId: string, limit?: number): Promise<GeofenceEvent[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username.toLowerCase()));
    return result[0] || undefined;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .returning() as User[];
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning() as User[];
    return result[0];
  }

  async getUsersByParentId(parentId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.parentId, parentId));
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete associated data first (cascading delete)
    await db.delete(allowanceBalances).where(eq(allowanceBalances.teenId, userId));
    await db.delete(allowanceSettings).where(eq(allowanceSettings.teenId, userId));
    await db.delete(transactions).where(eq(transactions.teenId, userId));
    await db.delete(incidents).where(eq(incidents.teenId, userId));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async getAllowanceSettings(parentId: string, teenId: string): Promise<AllowanceSettings | undefined> {
    const [settings] = await db
      .select()
      .from(allowanceSettings)
      .where(and(eq(allowanceSettings.parentId, parentId), eq(allowanceSettings.teenId, teenId)));
    return settings;
  }

  async upsertAllowanceSettings(settingsData: InsertAllowanceSettings): Promise<AllowanceSettings> {
    const [settings] = await db
      .insert(allowanceSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: [allowanceSettings.parentId, allowanceSettings.teenId],
        set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getTransactionsByTeenId(teenId: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.teenId, teenId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async getTransactionsByParentId(parentId: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.parentId, parentId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async createIncident(incidentData: InsertIncident): Promise<Incident> {
    const [incident] = await db
      .insert(incidents)
      .values(incidentData)
      .returning();
    return incident;
  }

  async getIncidentsByTeenId(teenId: string, limit = 10): Promise<Incident[]> {
    return await db
      .select()
      .from(incidents)
      .where(eq(incidents.teenId, teenId))
      .orderBy(desc(incidents.createdAt))
      .limit(limit);
  }

  async getIncidentsByDateRange(teenId: string, startDate: Date, endDate: Date): Promise<Incident[]> {
    return await db
      .select()
      .from(incidents)
      .where(
        and(
          eq(incidents.teenId, teenId),
          gte(incidents.createdAt, startDate),
          lte(incidents.createdAt, endDate)
        )
      )
      .orderBy(desc(incidents.createdAt));
  }

  async getAllowanceBalance(teenId: string): Promise<AllowanceBalance | undefined> {
    const [balance] = await db
      .select()
      .from(allowanceBalances)
      .where(eq(allowanceBalances.teenId, teenId));
    return balance;
  }

  async upsertAllowanceBalance(balanceData: InsertAllowanceBalance): Promise<AllowanceBalance> {
    const [balance] = await db
      .insert(allowanceBalances)
      .values(balanceData)
      .onConflictDoUpdate({
        target: allowanceBalances.teenId,
        set: {
          ...balanceData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return balance;
  }

  async updateBalance(teenId: string, amount: string, isDeduction = false): Promise<AllowanceBalance> {
    const currentBalance = await this.getAllowanceBalance(teenId);
    const currentAmount = parseFloat(currentBalance?.currentBalance || '0');
    const changeAmount = parseFloat(amount);
    const newBalance = isDeduction 
      ? Math.max(0, currentAmount - changeAmount).toFixed(2)  // Prevent negative balances
      : (currentAmount + changeAmount).toFixed(2);

    console.log(`Balance update for ${teenId}: ${currentAmount} ${isDeduction ? '-' : '+'} ${changeAmount} = ${newBalance}`);

    return await this.upsertAllowanceBalance({
      teenId,
      currentBalance: newBalance,
      lastAllowanceDate: currentBalance?.lastAllowanceDate,
      nextAllowanceDate: currentBalance?.nextAllowanceDate,
    });
  }

  async markTransactionAsPaid(transactionId: string): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set({
        realWorldStatus: "paid",
        paidAt: new Date(),
      })
      .where(eq(transactions.id, transactionId))
      .returning();
    return transaction;
  }

  async getOwedTransactionsByParent(parentId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.parentId, parentId),
          eq(transactions.realWorldStatus, "owed"),
          or(
            eq(transactions.type, "allowance"),
            eq(transactions.type, "bonus")
          )
        )
      )
      .orderBy(desc(transactions.createdAt));
  }

  async updateUserStripeInfo(userId: string, stripeInfo: Partial<Pick<User, 'stripeCustomerId' | 'stripeCardholderId' | 'stripeCardId' | 'cardStatus'>>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...stripeInfo,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, role));
  }

  async getSubscription(parentId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.parentId, parentId));
    return subscription;
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async updateSubscription(parentId: string, updates: Partial<InsertSubscription>): Promise<Subscription> {
    const [subscription] = await db
      .update(subscriptions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.parentId, parentId))
      .returning();
    return subscription;
  }

  async getTeenCountForParent(parentId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(eq(users.parentId, parentId), eq(users.role, 'teen')));
    return result[0]?.count || 0;
  }

  calculateSubscriptionPrice(tier: 'safety_first' | 'safety_plus' | 'driveallow_pro' | 'driveallow_pro_yearly', teenCount: number): { basePrice: string; additionalPrice: string; totalPrice: string } {
    if (tier === 'driveallow_pro_yearly') {
      // Yearly pricing for DriveAllow Pro - $999/year for unlimited teen drivers
      const basePrice = "999.00";
      const additionalPrice = "0.00"; // No additional cost for more teens
      const totalPrice = "999.00";
      return { basePrice, additionalPrice, totalPrice };
    }
    
    // Monthly pricing for DriveAllow Pro - $99/month for unlimited teen drivers
    const basePrice = "99.00";
    const additionalPrice = "0.00"; // No additional cost for more teens
    const totalPrice = "99.00";
    
    return { basePrice, additionalPrice, totalPrice };
  }

  calculateProratedAmount(tier: 'safety_first' | 'safety_plus' | 'driveallow_pro' | 'driveallow_pro_yearly', currentPeriodStart: Date, currentPeriodEnd: Date): string {
    // No prorated charges for DriveAllow Pro since unlimited teens are included
    return "0.00";
  }

  // Geofence operations
  async getGeofences(parentId: string): Promise<Geofence[]> {
    return await db
      .select()
      .from(geofences)
      .where(eq(geofences.parentId, parentId))
      .orderBy(desc(geofences.createdAt));
  }

  async createGeofence(geofenceData: InsertGeofence): Promise<Geofence> {
    const [geofence] = await db
      .insert(geofences)
      .values(geofenceData)
      .returning();
    return geofence;
  }

  async updateGeofence(id: string, updates: Partial<InsertGeofence>): Promise<Geofence | undefined> {
    const [geofence] = await db
      .update(geofences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(geofences.id, id))
      .returning();
    return geofence;
  }

  async deleteGeofence(id: string): Promise<boolean> {
    const result = await db
      .delete(geofences)
      .where(eq(geofences.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getGeofenceEvents(teenId: string, parentId: string, limit = 50): Promise<GeofenceEvent[]> {
    return await db
      .select()
      .from(geofenceEvents)
      .where(and(
        eq(geofenceEvents.teenId, teenId),
        eq(geofenceEvents.parentId, parentId)
      ))
      .orderBy(desc(geofenceEvents.createdAt))
      .limit(limit);
  }

}

export const storage = new DatabaseStorage();
