import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const candidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

const envPath = candidates.find((p) => fs.existsSync(p));

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn('[env] No .env file found. Looked in:', candidates);
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};