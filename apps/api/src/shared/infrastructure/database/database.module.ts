import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { identitySchema } from '../../../modules/identity/infrastructure/persistence/drizzle/identity.schema.js';
import { EnvironmentConfig } from '../config/environment.config.js';
import { DATABASE_POOL, DRIZZLE_DB } from './database.tokens.js';

export type AppDatabase = NodePgDatabase<typeof identitySchema>;

const databaseProvider = {
  provide: DRIZZLE_DB,
  inject: [DATABASE_POOL],
  useFactory: (pool: pg.Pool): AppDatabase =>
    drizzle(pool, { schema: identitySchema }),
};

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [EnvironmentConfig],
      useFactory: (config: EnvironmentConfig): pg.Pool =>
        new pg.Pool({ connectionString: config.databaseUrl }),
    },
    databaseProvider,
  ],
  exports: [DATABASE_POOL, DRIZZLE_DB],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_POOL) private readonly pool: pg.Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
