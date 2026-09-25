import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });
dotenv.config(); // fallback to current working directory .env

function resolveDataDirectory(): string {
  // Check possible directory locations
  const serverData = path.resolve(process.cwd(), 'server', 'data');
  if (fs.existsSync(serverData)) {
    return serverData;
  }
  const rootData = path.resolve(process.cwd(), 'data');
  if (fs.existsSync(rootData)) {
    return rootData;
  }
  return serverData;
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiSecretKey: process.env.API_SECRET_KEY || 'default_dev_secret_never_use_in_prod',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  dataDir: resolveDataDirectory(),
  logLevel: process.env.LOG_LEVEL || 'info',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Mask secret for safe logging
export function getMaskedSecret(secret: string): string {
  if (!secret || secret.length <= 6) return '******';
  return `${secret.slice(0, 3)}...${secret.slice(-3)}`;
}
