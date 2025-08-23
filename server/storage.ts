import {
  users,
  allowanceSettings,
  transactions,
  incidents,
  allowanceBalances,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByParentId(parentId: string): Promise<User[]>;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
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
}

export const storage = new DatabaseStorage();
