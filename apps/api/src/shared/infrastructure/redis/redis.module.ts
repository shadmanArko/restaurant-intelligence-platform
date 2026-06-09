import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';

import { EnvironmentConfig } from '../config/environment.config.js';
import { REDIS_CLIENT } from './redis.tokens.js';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [EnvironmentConfig],
      useFactory: (config: EnvironmentConfig): Redis =>
        new Redis({
          host: config.redisHost,
          port: config.redisPort,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    this.redis.disconnect();
  }
}
