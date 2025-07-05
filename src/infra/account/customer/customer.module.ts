import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CreateCustomerUseCase } from '@core/account/application/use-cases/create-customer.use-case';
import { CustomerRepository } from '@core/account/domain/repositories/customer.repository';
import { IAMProvider } from '@core/account/domain/providers/iam.provider';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { PrismaCustomerRepository } from '@core/account/infra/db/repositories/customer-prisma.repository';
import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { DomainIAMProvider } from '@core/account/infra/providers/domain-iam.provider';
import { ApplicationService } from '@core/common/application/application.service';
import { SetAccountPasswordUseCase } from '@core/iam/application/use-cases/set-account-password.use-case';
import { AccountModule } from '@/infra/iam/account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [CustomerController],
  providers: [
    {
      provide: CustomerRepository,
      useFactory: (prismaManager: PrismaManager, uow: UnitOfWork) => {
        return new PrismaCustomerRepository(prismaManager, uow);
      },
      inject: [PrismaManager, UnitOfWork],
    },
    {
      provide: IAMProvider,
      useFactory: (setAccountPasswordUseCase: SetAccountPasswordUseCase) => {
        return new DomainIAMProvider(setAccountPasswordUseCase);
      },
      inject: [SetAccountPasswordUseCase],
    },
    {
      provide: CreateCustomerUseCase,
      useFactory: (
        app: ApplicationService,
        customerRepository: CustomerRepository,
        iamProvider: IAMProvider,
        uow: UnitOfWork,
      ) => {
        return app.wrap(new CreateCustomerUseCase(customerRepository, iamProvider, uow));
      },
      inject: [ApplicationService, CustomerRepository, IAMProvider, UnitOfWork],
    },
  ],
})
export class CustomerModule {}
