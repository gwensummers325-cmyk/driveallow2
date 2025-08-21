import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { emailService } from "./emailService";
import { 
  insertAllowanceSettingsSchema,
  insertTransactionSchema,
  insertIncidentSchema,
  insertAllowanceBalanceSchema
} from "@shared/schema";
import { z } from "zod";
import { createTestAccounts } from "./create-test-accounts";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Test accounts creation endpoint (remove in production)
  app.post('/api/create-test-accounts', async (req, res) => {
    try {
      await createTestAccounts();
      res.json({ message: "Test accounts created successfully" });
    } catch (error) {
      console.error("Error creating test accounts:", error);
      res.status(500).json({ message: "Failed to create test accounts" });
    }
  });

  // Create teen account (only for authenticated parents)
  app.post('/api/teens', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const parent = await storage.getUser(parentId);
      
      if (!parent || parent.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can create teen accounts" });
      }

      const { firstName, lastName, username, email, password } = req.body;
      
      if (!firstName || !lastName || !username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create teen account
      const teen = await storage.createUser({
        username,
        email: email || '',
        firstName,
        lastName,
        role: 'teen',
        password: hashedPassword,
        parentId,
      });

      // Create initial allowance settings
      await storage.upsertAllowanceSettings({
        parentId,
        teenId: teen.id,
        weeklyAmount: "25.00",
        frequency: "weekly",
        allowOverdraft: true,
        speedingMinorPenalty: "5.00",
        speedingMajorPenalty: "10.00",
        harshBrakingPenalty: "3.00",
        aggressiveAccelPenalty: "3.00",
        weeklyBonus: "5.00",
        perfectWeekBonus: "10.00",
        speedComplianceBonus: "2.00",
      });

      // Create initial balance
      await storage.upsertAllowanceBalance({
        teenId: teen.id,
        currentBalance: "25.00",
        lastAllowanceDate: new Date(),
        nextAllowanceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.status(201).json({
        id: teen.id,
        username: teen.username,
        firstName: teen.firstName,
        lastName: teen.lastName,
        email: teen.email,
        role: teen.role,
      });
    } catch (error) {
      console.error("Error creating teen account:", error);
      res.status(500).json({ message: "Failed to create teen account" });
    }
  });

  // Dashboard data routes
  app.get('/api/dashboard/parent', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const parent = await storage.getUser(parentId);
      
      if (!parent || parent.role !== 'parent') {
        return res.status(403).json({ message: "Access denied" });
      }

      const teens = await storage.getUsersByParentId(parentId);
      const transactions = await storage.getTransactionsByParentId(parentId, 20);
      
      // Get balance and allowance settings for each teen
      const teensWithData = await Promise.all(teens.map(async (teen: any) => {
        const balance = await storage.getAllowanceBalance(teen.id);
        const settings = await storage.getAllowanceSettings(parentId, teen.id);
        return {
          ...teen,
          balance: balance || { currentBalance: '0.00' },
          settings: settings || {}
        };
      }));
      
      const dashboardData = {
        parent,
        teens: teensWithData,
        transactions,
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching parent dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/dashboard/teen', isAuthenticated, async (req: any, res) => {
    try {
      const teenId = req.user.id;
      const teen = await storage.getUser(teenId);
      
      if (!teen || teen.role !== 'teen') {
        return res.status(403).json({ message: "Access denied" });
      }

      const balance = await storage.getAllowanceBalance(teenId);
      const transactions = await storage.getTransactionsByTeenId(teenId, 20);
      const incidents = await storage.getIncidentsByTeenId(teenId, 10);
      
      // Calculate weekly violations
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weeklyIncidents = await storage.getIncidentsByDateRange(teenId, weekStart, new Date());

      const dashboardData = {
        teen,
        balance: balance || { currentBalance: '0.00' },
        transactions,
        incidents,
        weeklyViolations: weeklyIncidents.length,
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching teen dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Allowance settings routes
  app.get('/api/allowance-settings/:teenId', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const { teenId } = req.params;
      
      const settings = await storage.getAllowanceSettings(parentId, teenId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching allowance settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post('/api/allowance-settings', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const validatedData = insertAllowanceSettingsSchema.parse({
        ...req.body,
        parentId,
      });
      
      const settings = await storage.upsertAllowanceSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error saving allowance settings:", error);
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  // Incident reporting routes
  app.post('/api/incidents', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const incidentSchema = insertIncidentSchema.extend({
        teenId: z.string(),
      });
      
      const validatedData = incidentSchema.parse({
        ...req.body,
        parentId,
      });

      // Create the incident
      const incident = await storage.createIncident(validatedData);

      // Create corresponding transaction
      const transaction = await storage.createTransaction({
        teenId: validatedData.teenId,
        parentId,
        type: 'penalty',
        amount: `-${validatedData.penaltyAmount}`,
        description: `Penalty for ${validatedData.type.replace('_', ' ')}`,
        location: validatedData.location,
        notes: validatedData.notes,
      });

      // Update balance
      await storage.updateBalance(validatedData.teenId, `-${validatedData.penaltyAmount}`);

      // Send email notifications
      const teen = await storage.getUser(validatedData.teenId);
      const parent = await storage.getUser(parentId);
      
      if (teen?.email && parent?.email) {
        await emailService.sendIncidentNotification(
          parent.email,
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          validatedData.type.replace('_', ' '),
          validatedData.location || 'Unknown location',
          validatedData.penaltyAmount
        );
      }

      res.json({ incident, transaction });
    } catch (error) {
      console.error("Error reporting incident:", error);
      res.status(500).json({ message: "Failed to report incident" });
    }
  });

  // Bonus routes
  app.post('/api/bonuses', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const { teenId, amount, description } = req.body;

      // Create bonus transaction
      const transaction = await storage.createTransaction({
        teenId,
        parentId,
        type: 'bonus',
        amount: amount.toString(),
        description: description || 'Manual bonus',
      });

      // Update balance
      await storage.updateBalance(teenId, amount.toString());

      // Send email notifications
      const teen = await storage.getUser(teenId);
      const parent = await storage.getUser(parentId);
      
      if (teen?.email && parent?.email) {
        await emailService.sendBonusNotification(
          parent.email,
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          description || 'Manual bonus',
          amount.toString()
        );
      }

      res.json(transaction);
    } catch (error) {
      console.error("Error adding bonus:", error);
      res.status(500).json({ message: "Failed to add bonus" });
    }
  });

  // Allowance payment routes
  app.post('/api/allowance/pay', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const { teenId } = req.body;

      const settings = await storage.getAllowanceSettings(parentId, teenId);
      if (!settings) {
        return res.status(404).json({ message: "Allowance settings not found" });
      }

      // Create allowance transaction
      const transaction = await storage.createTransaction({
        teenId,
        parentId,
        type: 'allowance',
        amount: settings.weeklyAmount,
        description: 'Weekly allowance payment',
      });

      // Update balance and next payment date
      await storage.updateBalance(teenId, settings.weeklyAmount);
      
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7); // Add 7 days for weekly
      
      await storage.upsertAllowanceBalance({
        teenId,
        currentBalance: '0', // This will be updated by updateBalance
        lastAllowanceDate: new Date(),
        nextAllowanceDate: nextDate,
      });

      // Send email notification
      const teen = await storage.getUser(teenId);
      if (teen?.email) {
        await emailService.sendAllowanceNotification(
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          settings.weeklyAmount
        );
      }

      res.json(transaction);
    } catch (error) {
      console.error("Error paying allowance:", error);
      res.status(500).json({ message: "Failed to pay allowance" });
    }
  });

  // Balance routes
  app.get('/api/balance/:teenId', isAuthenticated, async (req: any, res) => {
    try {
      const { teenId } = req.params;
      const balance = await storage.getAllowanceBalance(teenId);
      res.json(balance || { currentBalance: '0.00' });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  // Transactions routes
  app.get('/api/transactions/:teenId', isAuthenticated, async (req: any, res) => {
    try {
      const { teenId } = req.params;
      const transactions = await storage.getTransactionsByTeenId(teenId, 50);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Monitoring routes
  app.get("/api/monitoring/dashboard", isAuthenticated, async (req: any, res) => {
    if (!req.user || req.user.role !== 'parent') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const parentId = req.user.id;
      const teens = await storage.getUsersByParentId(parentId);
      
      // Mock data for now - in real implementation, get from monitoring tables
      const activeTrips = teens.filter(() => Math.random() > 0.7); // Random active trips
      
      // Calculate aggregate metrics
      const totalActiveTrips = activeTrips.length;
      const averageSpeed = 28.5; // Mock average speed
      const safetyScore = 95; // Mock safety score
      
      res.json({
        teens: teens.map(teen => ({
          ...teen,
          isCurrentlyDriving: activeTrips.some(trip => trip.id === teen.id),
          currentSpeed: Math.random() > 0.5 ? 25 + Math.random() * 20 : 0,
          speedLimit: 35
        })),
        totalActiveTrips,
        averageSpeed,
        safetyScore
      });
    } catch (error) {
      console.error("Error fetching monitoring dashboard:", error);
      res.status(500).json({ message: "Failed to fetch monitoring dashboard" });
    }
  });
  
  app.get("/api/monitoring/active-trips", isAuthenticated, async (req: any, res) => {
    if (!req.user || req.user.role !== 'parent') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const parentId = req.user.id;
      const teens = await storage.getUsersByParentId(parentId);
      
      // Mock active trips data
      const activeTrips = teens.filter(() => Math.random() > 0.6).map(teen => ({
        id: `trip-${teen.id}`,
        teenId: teen.id,
        teenName: `${teen.firstName} ${teen.lastName}`,
        status: 'active',
        startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        startLocation: 'Home',
        currentSpeed: 25 + Math.random() * 20,
        maxSpeed: 35 + Math.random() * 10,
        totalDistance: Math.random() * 15,
        safetyScore: 85 + Math.random() * 15,
        recentViolations: []
      }));
      
      res.json(activeTrips);
    } catch (error) {
      console.error("Error fetching active trips:", error);
      res.status(500).json({ message: "Failed to fetch active trips" });
    }
  });
  
  app.get("/api/monitoring/violations/:teenId?", isAuthenticated, async (req: any, res) => {
    if (!req.user || req.user.role !== 'parent') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const parentId = req.user.id;
      const teenId = req.params.teenId;
      
      // Mock violations data
      const violations = [
        {
          id: 'v1',
          teenId: teenId,
          teenName: 'Test Teen',
          type: 'speeding_minor',
          severity: 'medium',
          speedRecorded: '42',
          speedLimit: '35',
          location: 'Main Street',
          autoReported: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ].filter(() => Math.random() > 0.5);
      
      res.json(violations);
    } catch (error) {
      console.error("Error fetching violations:", error);
      res.status(500).json({ message: "Failed to fetch violations" });
    }
  });
  
  app.get("/api/monitoring/alerts", isAuthenticated, async (req: any, res) => {
    if (!req.user || req.user.role !== 'parent') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const parentId = req.user.id;
      
      // Mock alerts data
      const alerts = [
        {
          id: 'a1',
          teenName: 'Test Teen',
          type: 'speed',
          message: 'Speed limit exceeded by 8 mph on Highway 101',
          severity: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        }
      ].filter(() => Math.random() > 0.7);
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });
  
  app.get("/api/monitoring/widget/:teenId", isAuthenticated, async (req: any, res) => {
    try {
      const teenId = req.params.teenId;
      
      // Mock widget data
      const weeklyViolations = Math.floor(Math.random() * 3);
      const safetyScore = Math.max(0, 100 - (weeklyViolations * 15));
      
      res.json({
        safetyScore,
        weeklyViolations,
        totalMiles: 127 + Math.random() * 50,
        averageSpeed: 25.5 + Math.random() * 10,
        lastViolation: weeklyViolations > 0 ? {
          type: 'speeding_minor',
          speedRecorded: '38',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        } : null,
        isCurrentlyDriving: Math.random() > 0.7
      });
    } catch (error) {
      console.error("Error fetching monitoring widget:", error);
      res.status(500).json({ message: "Failed to fetch monitoring widget" });
    }
  });
  
  app.get("/api/monitoring/active-trip/:teenId", isAuthenticated, async (req: any, res) => {
    try {
      const teenId = req.params.teenId;
      
      // Mock active trip data
      const hasActiveTrip = Math.random() > 0.6;
      const activeTrip = hasActiveTrip ? {
        id: `trip-${teenId}`,
        teenId,
        status: 'active',
        startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        currentSpeed: 25 + Math.random() * 15,
        speedLimit: 35,
        totalDistance: Math.random() * 10,
        safetyScore: 85 + Math.random() * 15
      } : null;
      
      res.json(activeTrip);
    } catch (error) {
      console.error("Error fetching active trip:", error);
      res.status(500).json({ message: "Failed to fetch active trip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
