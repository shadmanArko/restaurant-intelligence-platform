import { Env } from './env.schema.js';

export interface Configuration {
  readonly nodeEnv: Env['NODE_ENV'];
  readonly apiPort: number;
  readonly databaseUrl: string;
  readonly redisHost: string;
  readonly redisPort: number;
  readonly jwtSecret: string;
  readonly isProduction: boolean;
}

export function configuration(env: Env): Configuration {
  return {
    nodeEnv: env.NODE_ENV,
    apiPort: env.API_PORT,
    databaseUrl: env.DATABASE_URL,
    redisHost: env.REDIS_HOST,
    redisPort: env.REDIS_PORT,
    jwtSecret: env.JWT_SECRET,
    isProduction: env.NODE_ENV === 'production',
  };
}
