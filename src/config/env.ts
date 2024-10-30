// src/config/env.ts

const requiredEnvVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_API_URL',
  ] as const;
  
  type EnvVar = typeof requiredEnvVars[number];
  
  function getEnvVar(key: EnvVar): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
  
  export const env = {
    OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),
    API_URL: getEnvVar('NEXT_PUBLIC_API_URL'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
  } as const;