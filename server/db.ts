import dotenv from "dotenv";
dotenv.config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure SSL based on environment variables
const sslEnabled = process.env.DATABASE_SSL_ENABLED === 'true';
const poolConfig: any = { 
  connectionString: process.env.DATABASE_URL 
};

// Add SSL configuration if enabled (required for AWS RDS, Heroku Postgres, etc.)
if (sslEnabled) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
  };
}

export const pool = new Pool(poolConfig);
export const db = drizzle({ client: pool, schema });
