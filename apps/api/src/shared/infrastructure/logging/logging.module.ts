import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { EnvironmentConfig } from '../config/environment.config.js';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [EnvironmentConfig],
      useFactory: (config: EnvironmentConfig) => ({
        pinoHttp: {
          level: config.isProduction ? 'info' : 'debug',
          transport: config.isProduction
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              },
        },
      }),
    }),
  ],
})
export class LoggingModule {}
