import { storage } from './storage';
import { emailService } from './emailService';

export class AllowanceScheduler {
  private static instance: AllowanceScheduler;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): AllowanceScheduler {
    if (!AllowanceScheduler.instance) {
      AllowanceScheduler.instance = new AllowanceScheduler();
    }
    return AllowanceScheduler.instance;
  }

  start() {
    // Check every hour for due allowances
    this.intervalId = setInterval(() => {
      this.processScheduledAllowances();
    }, 60 * 60 * 1000); // 1 hour

    // Run immediately on start
    this.processScheduledAllowances();
    console.log('📅 Allowance scheduler started - checking for due payments every hour');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('📅 Allowance scheduler stopped');
    }
  }

  private async processScheduledAllowances() {
    try {
      const now = new Date();
      console.log(`📅 Checking for due allowances at ${now.toISOString()}`);

      // Check if database is available before proceeding
      try {
        await storage.getUsersByRole('teen');
      } catch (dbError) {
        console.log('⚠️  Database not available, skipping allowance processing');
        return;
      }

      // Get all teens
      const teens = await storage.getUsersByRole('teen');

      for (const teen of teens) {
        await this.processTeenAllowance(teen, now);
      }
    } catch (error) {
      console.error('Error processing scheduled allowances:', error);
    }
  }

  private async processTeenAllowance(teen: any, now: Date) {
    try {
      if (!teen.parentId) {
        console.log(`⚠️  Skipping teen ${teen.id} - no parent assigned`);
        return;
      }

      // Get teen's allowance balance and settings
      const balance = await storage.getAllowanceBalance(teen.id);
      const settings = await storage.getAllowanceSettings(teen.parentId, teen.id);

      if (!settings) {
        console.log(`⚠️  No allowance settings found for teen ${teen.id}`);
        return;
      }

      // Check if allowance is due
      if (!balance?.nextAllowanceDate || new Date(balance.nextAllowanceDate) > now) {
        return; // Not due yet
      }

      console.log(`💰 Processing allowance for ${teen.firstName} ${teen.lastName}`);

      // Calculate the allowance period start date
      const lastPaymentDate = balance.lastAllowanceDate ? new Date(balance.lastAllowanceDate) : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Get violations and bonuses for this period
      const { calculatedAmount, details } = await this.calculateAllowanceAmount(
        teen.id, 
        settings, 
        lastPaymentDate, 
        now
      );

      if (calculatedAmount > 0) {
        // Create allowance transaction
        const transaction = await storage.createTransaction({
          teenId: teen.id,
          parentId: teen.parentId,
          type: 'allowance',
          amount: calculatedAmount.toFixed(2),
          description: `Auto allowance: $${settings.allowanceAmount} ${details.violationSummary}${details.bonusSummary}`,
        });

        // Update balance and schedule next payment
        const nextPaymentDate = this.calculateNextPaymentDate(now, settings.frequency);
        
        await storage.upsertAllowanceBalance({
          teenId: teen.id,
          currentBalance: (parseFloat(balance.currentBalance || '0') + calculatedAmount).toFixed(2),
          lastAllowanceDate: now,
          nextAllowanceDate: nextPaymentDate,
        });

        // Send email notification
        const parent = await storage.getUser(teen.parentId);
        if (teen.email && parent?.email) {
          await emailService.sendAllowanceNotification(
            teen.email,
            `${teen.firstName} ${teen.lastName}`,
            calculatedAmount.toFixed(2),
            details.summary
          );
        }

        console.log(`✅ Allowance processed: ${teen.firstName} received $${calculatedAmount.toFixed(2)}`);
      } else {
        // Still update the next payment date even if amount is 0
        const nextPaymentDate = this.calculateNextPaymentDate(now, settings.frequency);
        await storage.upsertAllowanceBalance({
          teenId: teen.id,
          currentBalance: balance.currentBalance || '0.00',
          lastAllowanceDate: now,
          nextAllowanceDate: nextPaymentDate,
        });

        console.log(`⚠️  No allowance paid to ${teen.firstName} - violations exceeded allowance amount`);
      }
    } catch (error) {
      console.error(`Error processing allowance for teen ${teen.id}:`, error);
    }
  }

  private async calculateAllowanceAmount(
    teenId: string, 
    settings: any, 
    startDate: Date, 
    endDate: Date
  ) {
    // Get violations and bonuses for the period
    const incidents = await storage.getIncidentsByDateRange(teenId, startDate, endDate);
    const transactions = await storage.getTransactionsByTeenId(teenId, 50);
    
    const periodBonuses = transactions.filter(t => 
      t.type === 'bonus' && 
      new Date(t.createdAt!) >= startDate && 
      new Date(t.createdAt!) <= endDate
    );

    // Calculate total penalties
    let totalPenalties = 0;
    let violationCount = 0;
    
    for (const incident of incidents) {
      totalPenalties += parseFloat(incident.penaltyAmount);
      violationCount++;
    }

    // Calculate total bonuses
    const totalBonuses = periodBonuses.reduce((sum, bonus) => 
      sum + parseFloat(bonus.amount), 0
    );

    // Calculate final amount
    const baseAmount = parseFloat(settings.allowanceAmount);
    const calculatedAmount = Math.max(0, baseAmount - totalPenalties + totalBonuses);

    // Create summary strings
    const violationSummary = violationCount > 0 
      ? `- $${totalPenalties.toFixed(2)} penalties (${violationCount} violations)` 
      : '';
    
    const bonusSummary = totalBonuses > 0 
      ? `+ $${totalBonuses.toFixed(2)} bonuses` 
      : '';

    const summary = `Base allowance: $${baseAmount.toFixed(2)}${violationSummary ? ' ' + violationSummary : ''}${bonusSummary ? ' ' + bonusSummary : ''} = $${calculatedAmount.toFixed(2)}`;

    return {
      calculatedAmount,
      details: {
        baseAmount,
        totalPenalties,
        totalBonuses,
        violationCount,
        bonusCount: periodBonuses.length,
        violationSummary,
        bonusSummary,
        summary
      }
    };
  }

  private calculateNextPaymentDate(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'bi-weekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + 7); // Default to weekly
    }
    
    return nextDate;
  }
}