// Centralized configuration and environment variable validation

const requiredEnvVars = [
  'JWT_SECRET',
  'DATABASE_URL',
  'NEXTAUTH_SECRET'
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];

function getEnvVar(name: RequiredEnvVar): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  jwt: {
    secret: getEnvVar('JWT_SECRET')
  },
  database: {
    url: getEnvVar('DATABASE_URL')
  },
  auth: {
    secret: getEnvVar('NEXTAUTH_SECRET')
  },
  ai: {
    openaiKey: process.env['OPENAI_API_KEY'] || '',
    anthropicKey: process.env['ANTHROPIC_API_KEY'] || '',
    defaultModel: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
    maxTokens: Number(process.env['MAX_TOKENS'] || 2000),
    temperature: Number(process.env['TEMPERATURE'] || 0.7)
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    url: process.env['NEXTAUTH_URL'] || 'http://localhost:3000',
    port: Number(process.env['PORT'] || 3000)
  }
};

export type AppConfig = typeof config;

