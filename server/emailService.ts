import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ionos.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw error to prevent blocking the main flow
    }
  }

  async sendIncidentNotification(
    parentEmail: string,
    teenEmail: string,
    teenName: string,
    incidentType: string,
    location: string,
    penaltyAmount: string,
    balanceBefore?: string,
    balanceAfter?: string
  ): Promise<void> {
    const subject = `DriveAllow Alert: Driving Incident Detected for ${teenName}`;
    const balanceInfo = balanceBefore && balanceAfter ? `
- Balance Before: $${balanceBefore}
- Penalty Deducted: -$${penaltyAmount}
- Balance After: $${balanceAfter}` : `
- Penalty: $${penaltyAmount}`;

    const text = `
A driving incident has been reported for ${teenName}.

Incident Details:
- Type: ${incidentType}
- Location: ${location}${balanceInfo}
- Time: ${new Date().toLocaleString()}

Please review the incident in your DriveAllow dashboard.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveAllow Alert</h2>
        <p>A driving incident has been reported for <strong>${teenName}</strong>.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #D32F2F;">Incident Details</h3>
          <p><strong>Type:</strong> ${incidentType}</p>
          <p><strong>Location:</strong> ${location}</p>
          ${balanceBefore && balanceAfter ? `
          <div style="background: #fff; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #D32F2F;">
            <p style="margin: 5px 0;"><strong>Balance Before:</strong> $${balanceBefore}</p>
            <p style="margin: 5px 0; color: #D32F2F;"><strong>Penalty Deducted:</strong> -$${penaltyAmount}</p>
            <p style="margin: 5px 0;"><strong>Balance After:</strong> $${balanceAfter}</p>
          </div>` : `<p><strong>Penalty:</strong> $${penaltyAmount}</p>`}
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Please review the incident in your DriveAllow dashboard.</p>
      </div>
    `;

    // Send to both parent and teen
    await Promise.all([
      this.sendEmail({ to: parentEmail, subject, text, html }),
      this.sendEmail({ to: teenEmail, subject, text, html }),
    ]);
  }

  async sendBonusNotification(
    parentEmail: string,
    teenEmail: string,
    teenName: string,
    bonusType: string,
    bonusAmount: string
  ): Promise<void> {
    const subject = `DriveAllow Bonus: ${teenName} Earned a Reward!`;
    const text = `
Great news! ${teenName} has earned a bonus for safe driving.

Bonus Details:
- Type: ${bonusType}
- Amount: $${bonusAmount}
- Time: ${new Date().toLocaleString()}

Keep up the great work!
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveAllow Bonus</h2>
        <p>Great news! <strong>${teenName}</strong> has earned a bonus for safe driving.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #388E3C;">Bonus Details</h3>
          <p><strong>Type:</strong> ${bonusType}</p>
          <p><strong>Amount:</strong> $${bonusAmount}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Keep up the great work!</p>
      </div>
    `;

    await Promise.all([
      this.sendEmail({ to: parentEmail, subject, text, html }),
      this.sendEmail({ to: teenEmail, subject, text, html }),
    ]);
  }

  async sendAllowanceNotification(
    teenEmail: string,
    teenName: string,
    allowanceAmount: string,
    summary?: string
  ): Promise<void> {
    const subject = `DriveAllow: Your Weekly Allowance is Here!`;
    const text = `
Hi ${teenName}!

Your weekly allowance of $${allowanceAmount} has been added to your DriveAllow balance.

Time: ${new Date().toLocaleString()}

Check your dashboard to see your updated balance.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveAllow Allowance</h2>
        <p>Hi <strong>${teenName}</strong>!</p>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1976D2;">Weekly Allowance</h3>
          <p>Your weekly allowance of <strong>$${allowanceAmount}</strong> has been added to your balance.</p>
          ${summary ? `<p style="color: #666; font-size: 14px; margin-top: 15px;"><strong>Calculation:</strong><br>${summary}</p>` : ''}
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Check your dashboard to see your updated balance.</p>
      </div>
    `;

    await this.sendEmail({ to: teenEmail, subject, text, html });
  }

  async sendLoginNotification(
    parentEmail: string,
    teenName: string,
    deviceInfo?: string
  ): Promise<void> {
    const subject = `DriveAllow Alert: ${teenName} Logged In`;
    const loginTime = new Date().toLocaleString();
    const text = `
${teenName} has logged into DriveAllow.

Login Details:
- Teen: ${teenName}
- Time: ${loginTime}
- Device: ${deviceInfo || 'Unknown device'}

Driving monitoring is now active.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveAllow Login Alert</h2>
        <p><strong>${teenName}</strong> has logged into DriveAllow.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #388E3C;">Login Details</h3>
          <p><strong>Teen:</strong> ${teenName}</p>
          <p><strong>Time:</strong> ${loginTime}</p>
          <p><strong>Device:</strong> ${deviceInfo || 'Unknown device'}</p>
        </div>
        
        <p>Driving monitoring is now active.</p>
      </div>
    `;

    await this.sendEmail({ to: parentEmail, subject, text, html });
  }

  async sendLogoutNotification(
    parentEmail: string,
    teenName: string,
    sessionDuration?: string
  ): Promise<void> {
    const subject = `DriveAllow Alert: ${teenName} Logged Out`;
    const logoutTime = new Date().toLocaleString();
    const text = `
${teenName} has logged out of DriveAllow.

Session Details:
- Teen: ${teenName}
- Logout Time: ${logoutTime}
- Session Duration: ${sessionDuration || 'Unknown'}

Driving monitoring has ended.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveAllow Logout Alert</h2>
        <p><strong>${teenName}</strong> has logged out of DriveAllow.</p>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #F57C00;">Session Details</h3>
          <p><strong>Teen:</strong> ${teenName}</p>
          <p><strong>Logout Time:</strong> ${logoutTime}</p>
          <p><strong>Session Duration:</strong> ${sessionDuration || 'Unknown'}</p>
        </div>
        
        <p>Driving monitoring has ended.</p>
      </div>
    `;

    await this.sendEmail({ to: parentEmail, subject, text, html });
  }

  async sendTrialReminderNotification(
    parentEmail: string,
    parentName: string,
    daysLeft: number,
    planName: string,
    monthlyPrice: number
  ): Promise<void> {
    const subject = `DriveAllow: Your trial expires in ${daysLeft} days`;
    const text = `
Hi ${parentName},

Your DriveAllow ${planName} trial expires in ${daysLeft} days.

Your subscription will automatically continue at $${monthlyPrice}/month unless you cancel before your trial ends.

To manage your subscription or cancel, log into your DriveAllow parent dashboard.

Thanks for trying DriveAllow!
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">Trial Reminder</h2>
        <p>Hi ${parentName},</p>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #F57C00;">Trial Expiring Soon</h3>
          <p>Your DriveAllow <strong>${planName}</strong> trial expires in <strong>${daysLeft} days</strong>.</p>
          <p>Your subscription will automatically continue at <strong>$${monthlyPrice}/month</strong> unless you cancel before your trial ends.</p>
        </div>
        
        <p>To manage your subscription or cancel, log into your DriveAllow parent dashboard.</p>
        <p>Thanks for trying DriveAllow!</p>
      </div>
    `;

    await this.sendEmail({ to: parentEmail, subject, text, html });
  }

  async sendTrialUpgradeNotification(
    parentEmail: string,
    parentName: string,
    planName: string,
    monthlyPrice: number
  ): Promise<void> {
    const subject = `DriveAllow: Welcome to ${planName}!`;
    const text = `
Hi ${parentName},

Welcome to DriveAllow ${planName}! Your trial has ended and your subscription is now active.

Subscription Details:
- Plan: ${planName}
- Monthly Price: $${monthlyPrice}
- Next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

You can manage your subscription anytime from your parent dashboard.

Thanks for choosing DriveAllow to keep your teen safe on the road!
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">Welcome to DriveAllow!</h2>
        <p>Hi ${parentName},</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #388E3C;">Subscription Active</h3>
          <p>Welcome to DriveAllow <strong>${planName}</strong>! Your trial has ended and your subscription is now active.</p>
          
          <div style="margin-top: 15px;">
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Monthly Price:</strong> $${monthlyPrice}</p>
            <p><strong>Next billing date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
        </div>
        
        <p>You can manage your subscription anytime from your parent dashboard.</p>
        <p>Thanks for choosing DriveAllow to keep your teen safe on the road!</p>
      </div>
    `;

    await this.sendEmail({ to: parentEmail, subject, text, html });
  }

  async sendTrialCancellationNotification(
    parentEmail: string,
    parentName: string,
    planName: string
  ): Promise<void> {
    const subject = `DriveAllow: Trial cancelled`;
    const text = `
Hi ${parentName},

Your DriveAllow ${planName} trial has been cancelled as requested.

Your account will remain active until the end of your trial period, after which access to DriveAllow will end.

If you change your mind, you can reactivate your subscription anytime from your parent dashboard.

Thanks for trying DriveAllow!
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">Trial Cancelled</h2>
        <p>Hi ${parentName},</p>
        
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #D32F2F;">Subscription Cancelled</h3>
          <p>Your DriveAllow <strong>${planName}</strong> trial has been cancelled as requested.</p>
          <p>Your account will remain active until the end of your trial period, after which access to DriveAllow will end.</p>
        </div>
        
        <p>If you change your mind, you can reactivate your subscription anytime from your parent dashboard.</p>
        <p>Thanks for trying DriveAllow!</p>
      </div>
    `;

    await this.sendEmail({ to: parentEmail, subject, text, html });
  }
}

export const emailService = new EmailService();
