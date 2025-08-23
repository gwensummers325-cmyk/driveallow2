import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { emailService } from "./emailService";
import { trialManager } from "./trial-manager";
import { 
  insertAllowanceSettingsSchema,
  insertTransactionSchema,
  insertIncidentSchema,
  insertAllowanceBalanceSchema,
  insertSubscriptionSchema
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

  // Subscription management routes
  app.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const parent = await storage.getUser(parentId);
      
      if (!parent || parent.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can view subscription info" });
      }

      const subscription = await storage.getSubscription(parentId);
      const teenCount = await storage.getTeenCountForParent(parentId);
      
      // If no subscription exists, create a trial
      if (!subscription) {
        const pricing = storage.calculateSubscriptionPrice('safety_first', teenCount);
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial
        
        const newSubscription = await storage.createSubscription({
          parentId,
          tier: 'safety_first',
          status: 'trial',
          teenCount,
          basePrice: pricing.basePrice,
          additionalTeenPrice: pricing.additionalPrice,
          totalPrice: pricing.totalPrice,
          trialEndDate,
          phoneUsageAlertsEnabled: false,
        });
        
        return res.json({ ...newSubscription, teenCount });
      }
      
      res.json({ ...subscription, teenCount });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post('/api/subscription/select-tier', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const { tier } = req.body;
      
      if (!tier || !['safety_first', 'safety_plus'].includes(tier)) {
        return res.status(400).json({ message: "Invalid tier selected" });
      }
      
      const parent = await storage.getUser(parentId);
      if (!parent || parent.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can select subscription tiers" });
      }

      const teenCount = await storage.getTeenCountForParent(parentId);
      const pricing = storage.calculateSubscriptionPrice(tier, teenCount);
      
      let subscription = await storage.getSubscription(parentId);
      
      if (!subscription) {
        // Create new subscription with 7-day trial
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        
        subscription = await storage.createSubscription({
          parentId,
          tier,
          status: 'trial',
          teenCount,
          basePrice: pricing.basePrice,
          additionalTeenPrice: pricing.additionalPrice,
          totalPrice: pricing.totalPrice,
          trialEndDate,
          phoneUsageAlertsEnabled: tier === 'safety_plus',
        });
      } else {
        // Update existing subscription
        subscription = await storage.updateSubscription(parentId, {
          tier,
          teenCount,
          basePrice: pricing.basePrice,
          additionalTeenPrice: pricing.additionalPrice,
          totalPrice: pricing.totalPrice,
          phoneUsageAlertsEnabled: tier === 'safety_plus',
        });
      }
      
      res.json({ ...subscription, teenCount });
    } catch (error) {
      console.error("Error selecting subscription tier:", error);
      res.status(500).json({ message: "Failed to select subscription tier" });
    }
  });

  app.post('/api/subscription/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const parentId = req.user.id;
      const parent = await storage.getUser(parentId);
      
      if (!parent || parent.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can cancel subscriptions" });
      }

      const subscription = await storage.getSubscription(parentId);
      if (!subscription) {
        return res.status(404).json({ message: "No subscription found" });
      }
      
      const updatedSubscription = await storage.updateSubscription(parentId, {
        status: 'cancelled',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      });
      
      res.json(updatedSubscription);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  app.get('/api/subscription/pricing/:tier', async (req: any, res) => {
    try {
      const { tier } = req.params;
      const { teenCount = 1 } = req.query;
      
      if (!['safety_first', 'safety_plus'].includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }
      
      const pricing = storage.calculateSubscriptionPrice(tier as 'safety_first' | 'safety_plus', parseInt(teenCount as string));
      
      res.json({
        tier,
        teenCount: parseInt(teenCount as string),
        ...pricing,
        features: {
          safety_first: [
            'Smart allowance management',
            'Driving incident tracking', 
            'Email notifications',
            'Parent and teen dashboards',
            'Up to 2 drivers included'
          ],
          safety_plus: [
            'All Safety First features',
            'Phone usage during driving alerts',
            'Up to 2 drivers included'
          ]
        }[tier as 'safety_first' | 'safety_plus']
      });
    } catch (error) {
      console.error("Error fetching pricing:", error);
      res.status(500).json({ message: "Failed to fetch pricing" });
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
        allowanceAmount: "25.00",
        frequency: "weekly",
        speedingMinorPenalty: "5.00",
        speedingMajorPenalty: "10.00",
        harshBrakingPenalty: "3.00",
        aggressiveAccelPenalty: "3.00",
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
      
      // Update parent's subscription teen count
      const subscription = await storage.getSubscription(parentId);
      if (subscription) {
        const newTeenCount = await storage.getTeenCountForParent(parentId);
        const pricing = storage.calculateSubscriptionPrice(subscription.tier, newTeenCount);
        await storage.updateSubscription(parentId, {
          teenCount: newTeenCount,
          basePrice: pricing.basePrice,
          additionalTeenPrice: pricing.additionalPrice,
          totalPrice: pricing.totalPrice,
        });
      }

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

      // Create corresponding transaction (store penalty as positive amount)
      const transaction = await storage.createTransaction({
        teenId: validatedData.teenId,
        parentId,
        type: 'penalty',
        amount: validatedData.penaltyAmount,
        description: `Penalty for ${validatedData.type.replace('_', ' ')}`,
        location: validatedData.location,
        notes: validatedData.notes,
      });

      // Get balance before deduction
      const balanceBefore = await storage.getAllowanceBalance(validatedData.teenId);
      const balanceBeforeAmount = balanceBefore?.currentBalance || '0.00';
      
      // Update balance (deduct penalty amount)
      await storage.updateBalance(validatedData.teenId, validatedData.penaltyAmount, true);
      
      // Get balance after deduction
      const balanceAfter = await storage.getAllowanceBalance(validatedData.teenId);
      const balanceAfterAmount = balanceAfter?.currentBalance || '0.00';


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
          validatedData.penaltyAmount,
          balanceBeforeAmount,
          balanceAfterAmount
        );
      }

      res.json({ incident, transaction });
    } catch (error) {
      console.error("Error reporting incident:", error);
      res.status(500).json({ message: "Failed to report incident" });
    }
  });

  // Phone usage violation reporting
  app.post("/api/phone-violations", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    const { tripId, type, duration, timestamp, details } = req.body;
    
    try {
      // Get user to verify teen role
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'teen') {
        return res.status(403).json({ message: "Only teens can report phone violations" });
      }

      // Get teen's allowance settings to determine penalty amount
      const settings = await storage.getAllowanceSettings(user.parentId!, user.id);
      const penaltyAmount = parseFloat(settings?.phoneUsagePenalty || '15.00');

      // Create incident record
      const incident = await storage.createIncident({
        teenId: user.id,
        parentId: user.parentId!,
        type: 'phone_usage',
        location: 'Unknown location',
        penaltyAmount: penaltyAmount.toFixed(2),
        notes: `${type}: ${details || 'Phone used while driving'}`,
        autoReported: true,
        phoneUsageType: type,
        usageDuration: duration,
      });

      // Create penalty transaction
      const transaction = await storage.createTransaction({
        teenId: user.id,
        parentId: user.parentId!,
        type: 'penalty',
        amount: penaltyAmount.toFixed(2),
        description: `Phone usage violation: ${type}`,
        location: 'Detected automatically',
      });
      
      res.json({ 
        success: true, 
        incident,
        transaction,
        penaltyAmount 
      });
    } catch (error) {
      console.error('Error reporting phone violation:', error);
      res.status(500).json({ message: "Failed to report phone violation" });
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

      // Update balance (add bonus amount)
      await storage.updateBalance(teenId, amount.toString(), false);


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

  // Real-world payment tracking routes
  app.post('/api/transactions/:id/mark-paid', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (user.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can mark transactions as paid" });
      }

      const { id } = req.params;
      
      // Get transaction to verify ownership
      const existingTransaction = await storage.getTransactionById(id);
      if (!existingTransaction || existingTransaction.parentId !== user.id) {
        return res.status(404).json({ message: "Transaction not found or unauthorized" });
      }

      const transaction = await storage.markTransactionAsPaid(id);
      res.json(transaction);
    } catch (error) {
      console.error("Error marking transaction as paid:", error);
      res.status(500).json({ message: "Failed to mark transaction as paid" });
    }
  });

  app.get('/api/owed-transactions', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (user.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can view owed transactions" });
      }

      const owedTransactions = await storage.getOwedTransactionsByParent(user.id);
      res.json(owedTransactions);
    } catch (error) {
      console.error("Error fetching owed transactions:", error);
      res.status(500).json({ message: "Failed to fetch owed transactions" });
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
        amount: settings.allowanceAmount,
        description: 'Weekly allowance payment',
      });

      // Update balance and payment dates in one operation
      const currentBalance = await storage.getAllowanceBalance(teenId);
      const currentAmount = parseFloat(currentBalance?.currentBalance || '0');
      const changeAmount = parseFloat(settings.allowanceAmount);
      const newBalance = (currentAmount + changeAmount).toFixed(2);
      
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7); // Add 7 days for weekly
      
      await storage.upsertAllowanceBalance({
        teenId,
        currentBalance: newBalance,
        lastAllowanceDate: new Date(),
        nextAllowanceDate: nextDate,
      });


      // Send email notification
      const teen = await storage.getUser(teenId);
      if (teen?.email) {
        await emailService.sendAllowanceNotification(
          teen.email,
          `${teen.firstName} ${teen.lastName}`,
          settings.allowanceAmount
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

  // Smartphone Sensor Data Routes
  app.post('/api/smartphone-data', isAuthenticated, async (req: any, res) => {
    try {
      const sensorData = req.body;
      const userId = req.user.id;
      
      // Validate required sensor data fields
      if (!sensorData.teenId || !sensorData.gps || !sensorData.accelerometer) {
        return res.status(400).json({ 
          message: "Missing required sensor data fields (teenId, gps, accelerometer)" 
        });
      }

      // Ensure user can only submit data for themselves (teens) or their children (parents)
      if (req.user.role === 'teen' && sensorData.teenId !== userId) {
        return res.status(403).json({ message: "Can only submit your own driving data" });
      }
      
      if (req.user.role === 'parent') {
        const teen = await storage.getUser(sensorData.teenId);
        if (!teen || teen.parentId !== userId) {
          return res.status(403).json({ message: "Can only submit data for your teens" });
        }
      }

      // Process the smartphone sensor data for violations
      const { ViolationDetector } = await import('./violation-detector');
      const violations = await ViolationDetector.processSmartphoneData(sensorData);
      
      res.json({ 
        processed: true,
        timestamp: new Date().toISOString(),
        violations: violations.length,
        detectedViolations: violations.map(v => ({
          type: v.type,
          severity: v.severity,
          description: v.description,
          penalty: v.penaltyAmount
        }))
      });
    } catch (error) {
      console.error("Error processing smartphone sensor data:", error);
      res.status(500).json({ message: "Failed to process sensor data" });
    }
  });

  // Bulk sensor data upload (for buffered data from mobile apps)
  app.post('/api/smartphone-data/bulk', isAuthenticated, async (req: any, res) => {
    try {
      const { sensorDataArray } = req.body;
      const userId = req.user.id;
      
      if (!Array.isArray(sensorDataArray) || sensorDataArray.length === 0) {
        return res.status(400).json({ message: "sensorDataArray must be a non-empty array" });
      }

      const results = [];
      const { ViolationDetector } = await import('./violation-detector');
      
      for (const sensorData of sensorDataArray) {
        // Validate each data point
        if (!sensorData.teenId || !sensorData.gps || !sensorData.accelerometer) {
          continue; // Skip invalid data points
        }

        // Security check
        if (req.user.role === 'teen' && sensorData.teenId !== userId) {
          continue;
        }
        
        if (req.user.role === 'parent') {
          const teen = await storage.getUser(sensorData.teenId);
          if (!teen || teen.parentId !== userId) {
            continue;
          }
        }

        try {
          const violations = await ViolationDetector.processSmartphoneData(sensorData);
          results.push({
            timestamp: sensorData.timestamp,
            violations: violations.length,
            processed: true
          });
        } catch (error) {
          console.error('Error processing individual sensor data:', error);
          results.push({
            timestamp: sensorData.timestamp,
            violations: 0,
            processed: false,
            error: 'Processing failed'
          });
        }
      }
      
      res.json({ 
        totalProcessed: results.length,
        totalViolations: results.reduce((sum, r) => sum + r.violations, 0),
        results 
      });
    } catch (error) {
      console.error("Error processing bulk sensor data:", error);
      res.status(500).json({ message: "Failed to process bulk sensor data" });
    }
  });

  // Smartphone data upload statistics endpoint
  app.get('/api/smartphone-data/stats/:teenId', isAuthenticated, async (req: any, res) => {
    try {
      const teenId = req.params.teenId;
      
      // Check if teen exists and user has access
      const teen = await storage.getUser(teenId);
      if (!teen) {
        return res.status(404).json({ message: "Teen not found" });
      }

      // Security check
      if (req.user.role === 'teen' && req.user.id !== teenId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === 'parent' && teen.parentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get recent auto-detected incidents (last 7 days) as a proxy for uploads
      const recentIncidents = await storage.getIncidentsByTeenId(teenId);
      const autoDetectedIncidents = recentIncidents.filter(incident => {
        const incidentDate = new Date(incident.createdAt!);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return incidentDate >= weekAgo && incident.autoReported;
      });

      // Estimate upload count (each violation represents data processing)
      const estimatedUploads = Math.max(autoDetectedIncidents.length * 20, 0); // Rough estimate
      
      res.json({
        totalUploads: estimatedUploads,
        autoDetectedViolations: autoDetectedIncidents.length,
        lastUpload: autoDetectedIncidents[0]?.createdAt || null,
        isActive: true
      });
    } catch (error) {
      console.error("Error fetching smartphone data stats:", error);
      res.status(500).json({ message: "Failed to fetch upload stats" });
    }
  });

  app.get('/api/monitoring-status/:teenId', isAuthenticated, async (req: any, res) => {
    try {
      const teenId = req.params.teenId;
      
      // Check if teen exists
      const teen = await storage.getUser(teenId);
      if (!teen) {
        return res.status(404).json({ message: "Teen not found" });
      }

      // Get recent violations (last 7 days)
      const recentIncidents = await storage.getIncidentsByTeenId(teenId);
      const recentViolations = recentIncidents.filter(incident => {
        const incidentDate = new Date(incident.createdAt!);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return incidentDate >= weekAgo;
      });

      // Calculate monitoring metrics
      const totalViolations = recentViolations.length;
      const autoDetectedViolations = recentViolations.filter(v => v.autoReported).length;
      const manuallyReported = totalViolations - autoDetectedViolations;
      
      // Calculate safety score (simplified)
      const safetyScore = Math.max(0, 100 - (totalViolations * 10));

      res.json({
        isMonitoring: true,
        safetyScore,
        weeklyViolations: totalViolations,
        autoDetected: autoDetectedViolations,
        manuallyReported,
        lastViolation: recentViolations[0] || null,
        monitoringActive: true
      });
    } catch (error) {
      console.error("Error fetching monitoring status:", error);
      res.status(500).json({ message: "Failed to fetch monitoring status" });
    }
  });


  // Trial management endpoints (admin only - would typically be protected by admin role)
  app.post('/api/admin/process-trials', async (req, res) => {
    try {
      const result = await trialManager.processExpiredTrials();
      res.json(result);
    } catch (error) {
      console.error("Error processing trials:", error);
      res.status(500).json({ message: "Failed to process trials" });
    }
  });

  app.post('/api/admin/send-trial-reminders', async (req, res) => {
    try {
      const sentCount = await trialManager.sendTrialReminders();
      res.json({ sentReminders: sentCount });
    } catch (error) {
      console.error("Error sending trial reminders:", error);
      res.status(500).json({ message: "Failed to send trial reminders" });
    }
  });

  app.get('/api/admin/trial-stats', async (req, res) => {
    try {
      const stats = await trialManager.getTrialStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting trial stats:", error);
      res.status(500).json({ message: "Failed to get trial stats" });
    }
  });

  // Test email notifications endpoint
  app.post('/api/test-notifications', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      // Test incident notification
      await emailService.sendIncidentNotification(
        email, // parent email
        email, // teen email 
        "Test Teen",
        "speeding violation",
        "Main Street near school",
        "5.00",
        "25.00",
        "20.00"
      );

      // Test bonus notification
      await emailService.sendBonusNotification(
        email, // parent email
        email, // teen email
        "Test Teen",
        "Safe driving all week!",
        "10.00"
      );

      // Test login notification
      await emailService.sendLoginNotification(
        email,
        "Test Teen",
        "iPhone Mobile App"
      );

      // Test logout notification  
      await emailService.sendLogoutNotification(
        email,
        "Test Teen",
        "2 hours 15 minutes"
      );

      // Test allowance notification
      await emailService.sendAllowanceNotification(
        email,
        "Test Teen", 
        "20.00"
      );

      res.json({ 
        message: "Test notifications sent successfully",
        sentTo: email,
        count: 5
      });

    } catch (error) {
      console.error("Error sending test notifications:", error);
      res.status(500).json({ message: "Failed to send test notifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
