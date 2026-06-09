import { Global, Module } from '@nestjs/common';

import { configuration } from '../../../config/configuration.js';
import { validateEnv } from '../../../config/validate-env.js';
import { EnvironmentConfig } from './environment.config.js';

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentConfig,
      useFactory: (): EnvironmentConfig => {
        return new EnvironmentConfig(configuration(validateEnv(process.env)));
      },
    },
  ],
  exports: [EnvironmentConfig],
})
export class AppConfigModule {}
