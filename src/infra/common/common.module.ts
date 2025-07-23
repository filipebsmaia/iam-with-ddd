import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicationModule } from './application/application.module';
import { MessagingModule } from './messaging.module';
import { EventsModule } from './events.module';
import { AccountModule } from '../iam/account/account.module';
import { IAMProvider } from '@core/common/domain/providers/iam.provider';
import { DomainIAMProvider } from '@core/common/infra/providers/domain-iam.provider';
import { SetAccountPasswordUseCase } from '@core/iam/application/use-cases/set-account-password.use-case';
import { AccountQuery } from '@core/iam/application/query/account.query';

@Global()
@Module({
  imports: [DatabaseModule, MessagingModule, EventsModule, AccountModule, ApplicationModule],
  controllers: [],
  providers: [
    {
      provide: IAMProvider,
      useFactory: (setAccountPasswordUseCase: SetAccountPasswordUseCase, accountQuery: AccountQuery) => {
        return new DomainIAMProvider(setAccountPasswordUseCase, accountQuery);
      },
      inject: [SetAccountPasswordUseCase, AccountQuery],
    },
  ],
  exports: [IAMProvider],
})
export class CommonModule {}
