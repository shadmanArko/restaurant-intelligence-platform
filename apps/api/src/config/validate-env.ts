import { Env, envSchema } from './env.schema.js';

export function validateEnv(values: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }

  return parsed.data;
}
