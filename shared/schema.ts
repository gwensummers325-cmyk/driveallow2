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
  unique,
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

// Trip status enum
export const tripStatusEnum = pgEnum('trip_status', [
  'active',
  'completed',
  'cancelled'
]);

// Violation severity enum
export const violationSeverityEnum = pgEnum('violation_severity', [
  'low',
  'medium',
  'high',
  'critical'
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
  // Stripe fields
  stripeCustomerId: varchar("stripe_customer_id").unique(),
  stripeCardholderId: varchar("stripe_cardholder_id").unique(),
  stripeCardId: varchar("stripe_card_id").unique(),
  cardStatus: varchar("card_status").default('pending'), // pending, requested, active, suspended
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
  speedingMajorPenalty: decimal("speeding_major_penalty", { precision: 10, scale: 2 }).notNull().default('10.00'),
  harshBrakingPenalty: decimal("harsh_braking_penalty", { precision: 10, scale: 2 }).notNull().default('5.00'),
  aggressiveAccelPenalty: decimal("aggressive_accel_penalty", { precision: 10, scale: 2 }).notNull().default('5.00'),
  weeklyBonus: decimal("weekly_bonus", { precision: 10, scale: 2 }).notNull().default('5.00'),
  perfectWeekBonus: decimal("perfect_week_bonus", { precision: 10, scale: 2 }).notNull().default('10.00'),
  speedComplianceBonus: decimal("speed_compliance_bonus", { precision: 10, scale: 2 }).notNull().default('2.00'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  parentTeenUnique: unique().on(table.parentId, table.teenId),
}));

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
  autoReported: boolean("auto_reported").default(false),
  severity: varchar("severity", { length: 10 }).default('medium'),
  speedRecorded: varchar("speed_recorded"),
  speedLimit: varchar("speed_limit"),
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

// Driving trips table
export const drivingTrips = pgTable("driving_trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  status: tripStatusEnum("status").notNull().default('active'),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  startLocation: text("start_location"),
  endLocation: text("end_location"),
  totalDistance: decimal("total_distance", { precision: 10, scale: 2 }), // in miles
  maxSpeed: decimal("max_speed", { precision: 5, scale: 2 }), // in mph
  avgSpeed: decimal("avg_speed", { precision: 5, scale: 2 }), // in mph
  speedViolations: text("speed_violations").array().default([]), // JSON array of violations
  aggressiveEvents: text("aggressive_events").array().default([]), // JSON array of events
  safetyScore: decimal("safety_score", { precision: 5, scale: 2 }), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time driving data table
export const drivingData = pgTable("driving_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  tripId: varchar("trip_id").references(() => drivingTrips.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  speed: decimal("speed", { precision: 5, scale: 2 }).notNull(), // mph
  acceleration: decimal("acceleration", { precision: 6, scale: 3 }), // m/s²
  brakeForce: decimal("brake_force", { precision: 6, scale: 3 }), // g-force
  speedLimit: decimal("speed_limit", { precision: 5, scale: 2 }), // mph
  isActive: boolean("is_active").notNull().default(true),
});

// Driving violations table (auto-detected)
export const drivingViolations = pgTable("driving_violations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  tripId: varchar("trip_id").references(() => drivingTrips.id),
  type: incidentTypeEnum("type").notNull(),
  severity: violationSeverityEnum("severity").notNull().default('medium'),
  speedRecorded: decimal("speed_recorded", { precision: 5, scale: 2 }),
  speedLimit: decimal("speed_limit", { precision: 5, scale: 2 }),
  location: text("location"),
  autoReported: boolean("auto_reported").notNull().default(true),
  incidentId: varchar("incident_id").references(() => incidents.id), // Link to created incident
  createdAt: timestamp("created_at").defaultNow(),
});

// Monitoring alerts table
export const monitoringAlerts = pgTable("monitoring_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teenId: varchar("teen_id").notNull().references(() => users.id),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'speed', 'harsh_brake', 'aggressive_accel', 'trip_start', 'trip_end'
  message: text("message").notNull(),
  severity: violationSeverityEnum("severity").notNull().default('medium'),
  isRead: boolean("is_read").notNull().default(false),
  tripId: varchar("trip_id").references(() => drivingTrips.id),
  violationId: varchar("violation_id").references(() => drivingViolations.id),
  createdAt: timestamp("created_at").defaultNow(),
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

export const drivingTripsRelations = relations(drivingTrips, ({ one, many }) => ({
  teen: one(users, {
    fields: [drivingTrips.teenId],
    references: [users.id],
  }),
  drivingData: many(drivingData),
  violations: many(drivingViolations),
  alerts: many(monitoringAlerts),
}));

export const drivingDataRelations = relations(drivingData, ({ one }) => ({
  teen: one(users, {
    fields: [drivingData.teenId],
    references: [users.id],
  }),
  trip: one(drivingTrips, {
    fields: [drivingData.tripId],
    references: [drivingTrips.id],
  }),
}));

export const drivingViolationsRelations = relations(drivingViolations, ({ one }) => ({
  teen: one(users, {
    fields: [drivingViolations.teenId],
    references: [users.id],
  }),
  trip: one(drivingTrips, {
    fields: [drivingViolations.tripId],
    references: [drivingTrips.id],
  }),
  incident: one(incidents, {
    fields: [drivingViolations.incidentId],
    references: [incidents.id],
  }),
}));

export const monitoringAlertsRelations = relations(monitoringAlerts, ({ one }) => ({
  teen: one(users, {
    fields: [monitoringAlerts.teenId],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [monitoringAlerts.parentId],
    references: [users.id],
  }),
  trip: one(drivingTrips, {
    fields: [monitoringAlerts.tripId],
    references: [drivingTrips.id],
  }),
  violation: one(drivingViolations, {
    fields: [monitoringAlerts.violationId],
    references: [drivingViolations.id],
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

export const insertDrivingTripSchema = createInsertSchema(drivingTrips).omit({
  id: true,
  createdAt: true,
});

export const insertDrivingDataSchema = createInsertSchema(drivingData).omit({
  id: true,
  timestamp: true,
});

export const insertDrivingViolationSchema = createInsertSchema(drivingViolations).omit({
  id: true,
  createdAt: true,
});

export const insertMonitoringAlertSchema = createInsertSchema(monitoringAlerts).omit({
  id: true,
  createdAt: true,
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
export type DrivingTrip = typeof drivingTrips.$inferSelect;
export type InsertDrivingTrip = z.infer<typeof insertDrivingTripSchema>;
export type DrivingData = typeof drivingData.$inferSelect;
export type InsertDrivingData = z.infer<typeof insertDrivingDataSchema>;
export type DrivingViolation = typeof drivingViolations.$inferSelect;
export type InsertDrivingViolation = z.infer<typeof insertDrivingViolationSchema>;
export type MonitoringAlert = typeof monitoringAlerts.$inferSelect;
export type InsertMonitoringAlert = z.infer<typeof insertMonitoringAlertSchema>;
