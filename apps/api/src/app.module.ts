import { Module } from '@nestjs/common';

import { IdentityModule } from './modules/identity/identity.module.js';
import { SharedInfrastructureModule } from './shared/infrastructure/shared-infrastructure.module.js';
import { HealthModule } from './shared/presentation/health/health.module.js';

@Module({
  imports: [SharedInfrastructureModule, HealthModule, IdentityModule],
})
export class AppModule {}
