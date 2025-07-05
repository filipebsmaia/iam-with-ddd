import { ApplicationService } from '@core/common/application/application.service';

import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { ExceptionHandler } from './exception-handler';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ABACGuard } from './guards/abac.guard';
import { SignableTokenModule } from '@/infra/iam/account/signable-token.module';

@Global()
@Module({
  controllers: [],
  imports: [DiscoveryModule, SignableTokenModule],
  providers: [
    ApplicationService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ABACGuard,
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
