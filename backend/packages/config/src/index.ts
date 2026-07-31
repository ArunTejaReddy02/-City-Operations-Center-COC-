import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend workspace or root if exists
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().default('postgresql://vizagops:vizagops_password@localhost:5432/vizagops_db?schema=public'),
  JWT_SECRET: z.string().default('dev-jwt-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  GROQ_API_KEY: z.string().optional().default(''),
  AUDIT_SERVICE_URL: z.string().default('http://localhost:3001/api/v1/audit'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
