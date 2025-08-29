import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use DATABASE_URL from environment, or fall back to a default for development
const databaseUrl = process.env.DATABASE_URL || process.env.REPLIT_DB_URL || 'postgresql://localhost:5432/defaultdb';
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!databaseUrl) {
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });