import { Injectable } from '@nestjs/common';

import { Configuration } from '../../../config/configuration.js';

@Injectable()
export class EnvironmentConfig {
  constructor(private readonly values: Configuration) {}

  get nodeEnv(): Configuration['nodeEnv'] {
    return this.values.nodeEnv;
  }

  get apiPort(): number {
    return this.values.apiPort;
  }

  get databaseUrl(): string {
    return this.values.databaseUrl;
  }

  get redisHost(): string {
    return this.values.redisHost;
  }

  get redisPort(): number {
    return this.values.redisPort;
  }

  get jwtSecret(): string {
    return this.values.jwtSecret;
  }

  get isProduction(): boolean {
    return this.values.isProduction;
  }
}
