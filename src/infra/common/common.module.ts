import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicationModule } from './application/application.module';
import { MessagingModule } from './messaging.module';
import { EventsModule } from './events.module';
import { AccountModule } from '../iam/account/account.module';
import { IAMProvider } from '@core/common/domain/providers/iam.provider';
import { DomainIAMProvider } from '@core/common/infra/providers/domain-iam.provider';
import { SetAccountPasswordCommand } from '@core/iam/application/commands/set-account-password.command';
import { AccountQueryService } from '@core/iam/application/services/account-query.service';

@Global()
@Module({
  imports: [DatabaseModule, MessagingModule, EventsModule, AccountModule, ApplicationModule],
  controllers: [],
  providers: [
    {
      provide: IAMProvider,
      useFactory: (setAccountPasswordCommand: SetAccountPasswordCommand, accountQueryService: AccountQueryService) => {
        return new DomainIAMProvider(setAccountPasswordCommand, accountQueryService);
      },
      inject: [SetAccountPasswordCommand, AccountQueryService],
    },
  ],
  exports: [IAMProvider],
})
export class CommonModule {}
