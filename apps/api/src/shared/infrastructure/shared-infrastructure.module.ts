import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { LoggingModule } from './logging/logging.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [AppConfigModule, LoggingModule, DatabaseModule, RedisModule],
  exports: [AppConfigModule, DatabaseModule, RedisModule],
})
export class SharedInfrastructureModule {}
