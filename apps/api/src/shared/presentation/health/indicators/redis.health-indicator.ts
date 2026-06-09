import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '../../../infrastructure/redis/redis.tokens.js';

@Injectable()
export class RedisHealthIndicator {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    await this.redis.ping();
    return { [key]: { status: 'up' } };
  }
}
