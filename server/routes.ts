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

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

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
      
      // Get data for first teen or all teens
      const dashboardData = {
        parent,
        teens,
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

  const httpServer = createServer(app);
  return httpServer;
}
