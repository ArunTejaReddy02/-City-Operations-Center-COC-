import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root if exists
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().default('postgresql://vizagops:vizagops_password@localhost:5432/vizagops_db?schema=public'),
  JWT_SECRET: z.string().default('dev-jwt-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
