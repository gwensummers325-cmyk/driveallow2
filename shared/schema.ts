import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  decimal,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User role enum
export const userRoleEnum = pgEnum('user_role', ['parent', 'teen']);

// Transaction type enum
export const transactionTypeEnum = pgEnum('transaction_type', [
  'allowance',
  'penalty',
  'bonus',
  'incident'
]);

// Incident type enum
export const incidentTypeEnum = pgEnum('incident_type', [
  'speeding_minor',
  'speeding_major', 
  'harsh_braking',
  'aggressive_acceleration',
  'other'
]);

// Users table  
export const users: any = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('teen'),
  parentId: varchar("parent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Allowance settings table
export const allowanceSettings = pgTable("allowance_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  weeklyAmount: decimal("weekly_amount", { precision: 10, scale: 2 }).notNull().default('50.00'),
  frequency: varchar("frequency").notNull().default('weekly'), // weekly, bi-weekly, monthly
  allowOverdraft: boolean("allow_overdraft").notNull().default(true),
  speedingMinorPenalty: decimal("speeding_minor_penalty", { precision: 10, scale: 2 }).notNull().default('5.00'),
  speedingMajorPenalty: decimal("speeding_major_penalty", { precision: 10, scale: 2 }).notNull().default('15.00'),
  harshBrakingPenalty: decimal("harsh_braking_penalty", { precision: 10, scale: 2 }).notNull().default('5.00'),
  aggressiveAccelPenalty: decimal("aggressive_accel_penalty", { precision: 10, scale: 2 }).notNull().default('5.00'),
  weeklyBonus: decimal("weekly_bonus", { precision: 10, scale: 2 }).notNull().default('5.00'),
  perfectWeekBonus: decimal("perfect_week_bonus", { precision: 10, scale: 2 }).notNull().default('10.00'),
  speedComplianceBonus: decimal("speed_compliance_bonus", { precision: 10, scale: 2 }).notNull().default('2.00'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Incidents table
export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  type: incidentTypeEnum("type").notNull(),
  location: varchar("location"),
  penaltyAmount: decimal("penalty_amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  transactionId: varchar("transaction_id").references(() => transactions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Allowance balances table
export const allowanceBalances = pgTable("allowance_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id).unique(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull().default('0.00'),
  lastAllowanceDate: timestamp("last_allowance_date"),
  nextAllowanceDate: timestamp("next_allowance_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  parent: one(users, {
    fields: [users.parentId],
    references: [users.id],
    relationName: "parent_teen"
  }),
  teens: many(users, {
    relationName: "parent_teen"
  }),
  allowanceSettings: many(allowanceSettings),
  transactions: many(transactions),
  incidents: many(incidents),
  allowanceBalance: one(allowanceBalances),
}));

export const allowanceSettingsRelations = relations(allowanceSettings, ({ one }) => ({
  parent: one(users, {
    fields: [allowanceSettings.parentId],
    references: [users.id],
  }),
  teen: one(users, {
    fields: [allowanceSettings.teenId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  teen: one(users, {
    fields: [transactions.teenId],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [transactions.parentId],
    references: [users.id],
  }),
}));

export const incidentsRelations = relations(incidents, ({ one }) => ({
  teen: one(users, {
    fields: [incidents.teenId],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [incidents.parentId],
    references: [users.id],
  }),
  transaction: one(transactions, {
    fields: [incidents.transactionId],
    references: [transactions.id],
  }),
}));

export const allowanceBalancesRelations = relations(allowanceBalances, ({ one }) => ({
  teen: one(users, {
    fields: [allowanceBalances.teenId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAllowanceSettingsSchema = createInsertSchema(allowanceSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
});

export const insertAllowanceBalanceSchema = createInsertSchema(allowanceBalances).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AllowanceSettings = typeof allowanceSettings.$inferSelect;
export type InsertAllowanceSettings = z.infer<typeof insertAllowanceSettingsSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type AllowanceBalance = typeof allowanceBalances.$inferSelect;
export type InsertAllowanceBalance = z.infer<typeof insertAllowanceBalanceSchema>;
