import { storage } from "./storage";
import { emailService } from "./emailService";

interface TrialExpirationResult {
  checked: number;
  expired: number;
  upgraded: number;
  failed: number;
}

export class TrialManager {
  /**
   * Check for expired trials and handle automatic upgrades
   */
  static async processExpiredTrials(): Promise<TrialExpirationResult> {
    console.log('🔄 Processing expired trials...');
    
    const result: TrialExpirationResult = {
      checked: 0,
      expired: 0,
      upgraded: 0,
      failed: 0
    };

    try {
      // Get all active trial subscriptions
      const allUsers = await storage.getUsersByRole('parent');
      
      for (const parent of allUsers) {
        const subscription = await storage.getSubscription(parent.id);
        
        if (!subscription || subscription.status !== 'trial') {
          continue;
        }
        
        result.checked++;
        
        // Check if trial has expired
        const now = new Date();
        const trialEndDate = new Date(subscription.trialEndDate!);
        
        if (trialEndDate <= now) {
          result.expired++;
          console.log(`📅 Trial expired for parent ${parent.id}`);
          
          try {
            // Check if subscription was cancelled during trial
            if (subscription.cancelAtPeriodEnd) {
              await this.handleTrialCancellation(parent.id, subscription);
              console.log(`❌ Trial cancelled for parent ${parent.id}`);
            } else {
              await this.upgradeTrialToPaid(parent.id, subscription);
              result.upgraded++;
              console.log(`✅ Trial upgraded to paid for parent ${parent.id}`);
            }
          } catch (error) {
            console.error(`❌ Failed to process trial for parent ${parent.id}:`, error);
            result.failed++;
          }
        }
      }
      
      console.log(`🏁 Trial processing complete:`, result);
      return result;
    } catch (error) {
      console.error('❌ Error processing expired trials:', error);
      throw error;
    }
  }

  /**
   * Upgrade a trial subscription to paid
   */
  private static async upgradeTrialToPaid(parentId: string, subscription: any) {
    // TODO: Integrate with Stripe for actual payment processing
    // For now, we'll simulate the upgrade process
    
    const currentDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    
    await storage.updateSubscription(parentId, {
      status: 'active',
      currentPeriodStart: currentDate,
      currentPeriodEnd: nextBillingDate,
      // stripeSubscriptionId: 'stripe_sub_id_here', // Would be set by Stripe
    });
    
    // Send upgrade notification email
    const parent = await storage.getUser(parentId);
    if (parent?.email) {
      try {
        await emailService.sendTrialUpgradeNotification(
          parent.email,
          `${parent.firstName} ${parent.lastName}`,
          subscription.tier.replace('_', ' '),
          subscription.totalPrice
        );
      } catch (emailError) {
        console.error('Failed to send trial upgrade email:', emailError);
      }
    }
  }

  /**
   * Handle trial cancellation
   */
  private static async handleTrialCancellation(parentId: string, subscription: any) {
    await storage.updateSubscription(parentId, {
      status: 'cancelled',
      canceledAt: new Date(),
    });
    
    // Send cancellation confirmation email
    const parent = await storage.getUser(parentId);
    if (parent?.email) {
      try {
        await emailService.sendTrialCancellationNotification(
          parent.email,
          `${parent.firstName} ${parent.lastName}`,
          subscription.tier.replace('_', ' ')
        );
      } catch (emailError) {
        console.error('Failed to send trial cancellation email:', emailError);
      }
    }
  }

  /**
   * Send trial reminder emails
   */
  static async sendTrialReminders(): Promise<number> {
    console.log('📧 Sending trial reminder emails...');
    
    let sentReminders = 0;
    const allUsers = await storage.getUsersByRole('parent');
    
    for (const parent of allUsers) {
      const subscription = await storage.getSubscription(parent.id);
      
      if (!subscription || subscription.status !== 'trial' || !subscription.trialEndDate) {
        continue;
      }
      
      const now = new Date();
      const trialEndDate = new Date(subscription.trialEndDate);
      const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Send reminder 3 days before expiration
      if (daysLeft === 3 && parent.email) {
        try {
          await emailService.sendTrialReminderNotification(
            parent.email,
            `${parent.firstName} ${parent.lastName}`,
            daysLeft,
            subscription.tier.replace('_', ' '),
            subscription.totalPrice
          );
          sentReminders++;
          console.log(`📧 Trial reminder sent to ${parent.email}`);
        } catch (error) {
          console.error(`❌ Failed to send trial reminder to ${parent.email}:`, error);
        }
      }
    }
    
    console.log(`📧 Sent ${sentReminders} trial reminder emails`);
    return sentReminders;
  }

  /**
   * Get trial statistics
   */
  static async getTrialStats() {
    const allUsers = await storage.getUsersByRole('parent');
    const stats = {
      totalParents: allUsers.length,
      activeTrials: 0,
      expiredTrials: 0,
      paidSubscriptions: 0,
      cancelledSubscriptions: 0,
    };
    
    for (const parent of allUsers) {
      const subscription = await storage.getSubscription(parent.id);
      
      if (!subscription) continue;
      
      switch (subscription.status) {
        case 'trial':
          const trialEndDate = new Date(subscription.trialEndDate!);
          if (trialEndDate > new Date()) {
            stats.activeTrials++;
          } else {
            stats.expiredTrials++;
          }
          break;
        case 'active':
          stats.paidSubscriptions++;
          break;
        case 'cancelled':
          stats.cancelledSubscriptions++;
          break;
      }
    }
    
    return stats;
  }
}

// Export for use in routes and schedulers
export const trialManager = TrialManager;