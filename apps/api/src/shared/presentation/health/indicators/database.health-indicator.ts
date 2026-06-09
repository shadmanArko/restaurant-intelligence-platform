import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import pg from 'pg';

import { DATABASE_POOL } from '../../../infrastructure/database/database.tokens.js';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(@Inject(DATABASE_POOL) private readonly pool: pg.Pool) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    await this.pool.query('select 1');
    return { [key]: { status: 'up' } };
  }
}
