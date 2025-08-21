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
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
    penaltyAmount: string
  ): Promise<void> {
    const subject = `DriveWise Alert: Driving Incident Detected for ${teenName}`;
    const text = `
A driving incident has been reported for ${teenName}.

Incident Details:
- Type: ${incidentType}
- Location: ${location}
- Penalty: $${penaltyAmount}
- Time: ${new Date().toLocaleString()}

Please review the incident in your DriveWise dashboard.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveWise Alert</h2>
        <p>A driving incident has been reported for <strong>${teenName}</strong>.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #D32F2F;">Incident Details</h3>
          <p><strong>Type:</strong> ${incidentType}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Penalty:</strong> $${penaltyAmount}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Please review the incident in your DriveWise dashboard.</p>
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
    const subject = `DriveWise Bonus: ${teenName} Earned a Reward!`;
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
        <h2 style="color: #1976D2;">DriveWise Bonus</h2>
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
    allowanceAmount: string
  ): Promise<void> {
    const subject = `DriveWise: Your Weekly Allowance is Here!`;
    const text = `
Hi ${teenName}!

Your weekly allowance of $${allowanceAmount} has been added to your DriveWise balance.

Time: ${new Date().toLocaleString()}

Check your dashboard to see your updated balance.
    `;

    const html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976D2;">DriveWise Allowance</h2>
        <p>Hi <strong>${teenName}</strong>!</p>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1976D2;">Weekly Allowance</h3>
          <p>Your weekly allowance of <strong>$${allowanceAmount}</strong> has been added to your balance.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Check your dashboard to see your updated balance.</p>
      </div>
    `;

    await this.sendEmail({ to: teenEmail, subject, text, html });
  }
}

export const emailService = new EmailService();
