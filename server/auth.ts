import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { StripeService } from "./stripe-service";
import { User as DatabaseUser } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends DatabaseUser {}
    interface Session {
      loginTime?: number;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration with PostgreSQL storage
  const PostgresStore = connectPg(session);
  const sessionStore = new PostgresStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false, // Table already exists
    tableName: 'sessions',
  });

  const sessionSettings: session.SessionOptions = {
    secret: 'your-session-secret-key-for-development',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true, // Secure cookie handling
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax', // Allow cross-origin requests
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    }, async (username, password, done) => {
      try {
        console.log(`Login attempt for username: ${username}`);
        const user = await storage.getUserByUsername(username.toLowerCase());
        if (!user) {
          console.log(`User not found: ${username}`);
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          console.log(`Password mismatch for user: ${username}`);
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        console.log(`Login successful for user: ${username}`);
        return done(null, user);
      } catch (error) {
        console.error('Login error:', error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user: DatabaseUser, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (error) {
      done(error);
    }
  });

  // Register with payment method (for parents)
  app.post("/api/register-with-payment", async (req, res, next) => {
    try {
      const { 
        username, 
        password, 
        email, 
        firstName, 
        lastName, 
        selectedPlan, 
        paymentMethodId 
      } = req.body;
      
      // Validate required fields
      if (!username || !password || !email || !firstName || !lastName || !selectedPlan || !paymentMethodId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate plan
      if (!['safety_first', 'safety_plus', 'driveallow_pro', 'driveallow_pro_yearly'].includes(selectedPlan)) {
        return res.status(400).json({ message: "Invalid plan selection" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create parent user
      const user = await storage.createUser({
        username: username.toLowerCase(),
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: 'parent',
      });

      // Create Stripe customer with payment method
      const customerResult = await StripeService.createCustomer(
        email,
        `${firstName} ${lastName}`,
        paymentMethodId
      );

      if (!customerResult.success) {
        return res.status(400).json({ 
          message: `Payment setup failed: ${customerResult.error}` 
        });
      }

      // Determine the correct Stripe price ID based on plan
      let stripePriceId: string;
      if (selectedPlan === 'driveallow_pro') {
        stripePriceId = process.env.STRIPE_PRICE_ID_MONTHLY!;
      } else if (selectedPlan === 'driveallow_pro_yearly') {
        stripePriceId = process.env.STRIPE_PRICE_ID_YEARLY!;
      } else {
        // For legacy plans, use the monthly price ID as default
        stripePriceId = process.env.STRIPE_PRICE_ID_MONTHLY!;
      }

      // Create Stripe subscription with trial
      const subscriptionResult = await StripeService.createSubscription(
        customerResult.customerId!,
        stripePriceId,
        7 // 7-day trial
      );

      if (!subscriptionResult.success) {
        return res.status(400).json({ 
          message: `Subscription setup failed: ${subscriptionResult.error}` 
        });
      }

      // Create trial subscription in database
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial

      const pricing = storage.calculateSubscriptionPrice(selectedPlan, 1); // 1 teen initially
      
      await storage.createSubscription({
        parentId: user.id,
        tier: selectedPlan,
        status: 'trial',
        teenCount: 1,
        basePrice: pricing.basePrice,
        additionalTeenPrice: pricing.additionalPrice,
        totalPrice: pricing.totalPrice,
        trialEndDate,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndDate,
        phoneUsageAlertsEnabled: selectedPlan === 'safety_plus',
        stripeSubscriptionId: subscriptionResult.subscriptionId,
        stripePriceId: stripePriceId,
      });

      // Update user with Stripe customer ID
      await storage.updateUserStripeInfo(user.id, {
        stripeCustomerId: customerResult.customerId,
      });

      // Send admin notifications
      try {
        await emailService.sendParentSignupNotification(
          `${firstName} ${lastName}`,
          email,
          selectedPlan,
          trialEndDate
        );
        await emailService.sendParentPaymentNotification(
          `${firstName} ${lastName}`,
          email,
          selectedPlan,
          paymentMethodId
        );
      } catch (error) {
        console.error('Failed to send admin notifications:', error);
      }

      // Send welcome email to parent
      try {
        await emailService.sendWelcomeEmail(email, firstName);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscription: {
            tier: selectedPlan,
            status: 'trial',
            trialEndDate,
          }
        });
      });
    } catch (error) {
      console.error("Registration with payment error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Register endpoint (for basic registration without payment)
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email, firstName, lastName, role, parentId } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        username: username.toLowerCase(),
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: role || 'teen',
        parentId: role === 'teen' ? parentId : undefined,
      });

      // Send welcome email if user is a parent
      if (user.role === 'parent') {
        try {
          await emailService.sendWelcomeEmail(email, firstName);
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          parentId: user.parentId,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    console.log('Login request received:', {
      username: req.body.username,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      hasPassword: !!req.body.password
    });
    
    passport.authenticate("local", async (err: any, user: DatabaseUser | false, info: any) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        console.log('Login failed for:', req.body.username, 'Reason:', info?.message);
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, async (err) => {
        if (err) {
          console.error('Session login error:', err);
          return res.status(500).json({ message: "Login failed" });
        }

        console.log('Login successful, setting session data for:', user.username);
        
        // Store login time in session for session duration calculation
        (req.session as any).loginTime = Date.now();

        // Send login notification if user is a teen
        if (user.role === 'teen' && user.parentId) {
          try {
            const parent = await storage.getUser(user.parentId);
            if (parent && parent.email) {
              const userAgent = req.headers['user-agent'] || 'Unknown device';
              const deviceInfo = userAgent.includes('Mobile') ? 'Mobile device' : 
                                userAgent.includes('iPhone') ? 'iPhone' :
                                userAgent.includes('Android') ? 'Android device' : 
                                'Computer';
              
              await emailService.sendLoginNotification(
                parent.email,
                `${user.firstName} ${user.lastName}`,
                deviceInfo
              );
            }
          } catch (error) {
            console.error('Failed to send login notification:', error);
          }
        }

        res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          parentId: user.parentId,
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", async (req: any, res, next) => {
    const user = req.user as DatabaseUser;
    const loginTime = (req.session as any).loginTime;
    
    // Calculate session duration if available
    let sessionDuration = 'Unknown';
    if (loginTime) {
      const duration = Date.now() - loginTime;
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      sessionDuration = `${hours}h ${minutes}m`;
    }

    req.logout(async (err: any) => {
      if (err) return next(err);

      // Send logout notification if user was a teen
      if (user && user.role === 'teen' && user.parentId) {
        try {
          const parent = await storage.getUser(user.parentId);
          if (parent && parent.email) {
            await emailService.sendLogoutNotification(
              parent.email,
              `${user.firstName} ${user.lastName}`,
              sessionDuration
            );
          }
        } catch (error) {
          console.error('Failed to send logout notification:', error);
        }
      }

      res.sendStatus(200);
    });
  });

  // Current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as DatabaseUser;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      parentId: user.parentId,
    });
  });
}

// Middleware to check authentication
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}