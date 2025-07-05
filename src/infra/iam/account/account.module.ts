import { Module } from '@nestjs/common';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { ApplicationService } from '@core/common/application/application.service';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { PrismaAccountRepository } from '@core/iam/infra/db/repositories/account-prisma.repository';
import { RoleRepository } from '@core/iam/domain/repositories/role.repository';
import { PrismaRoleRepository } from '@core/iam/infra/db/repositories/role-prisma.repository';
import { SetAccountPasswordUseCase } from '@core/iam/application/use-cases/set-account-password.use-case';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { BcryptEncrypterProvider } from '@core/iam/infra/providers/bcrypt-encrypter.provider';
import { LoginAccountUseCase } from '@core/iam/application/use-cases/login-account.use-case';
import { LoginController } from './login.controller';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';
import { RefreshTokenUseCase } from '@core/iam/application/use-cases/refresh-token.use-case';
import { RefreshTokenController } from './refresh-token.controller';
import { SignableTokenModule } from './signable-token.module';
import { AccountController } from './account.controller';
import { GetAccountUseCase } from '@core/iam/application/use-cases/get-account';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { SpecificationsModule } from '../specifications.module';

@Module({
  imports: [SignableTokenModule, SpecificationsModule],
  controllers: [LoginController, RefreshTokenController, AccountController],
  providers: [
    {
      provide: AccountRepository,
      useFactory: (prismaManager: PrismaManager, uow: UnitOfWork) => {
        return new PrismaAccountRepository(prismaManager, uow);
      },
      inject: [PrismaManager, UnitOfWork],
    },
    {
      provide: RoleRepository,
      useFactory: (prismaManager: PrismaManager, uow: UnitOfWork) => {
        return new PrismaRoleRepository(prismaManager, uow);
      },
      inject: [PrismaManager, UnitOfWork],
    },
    {
      provide: EncrypterProvider,
      useFactory: () => {
        return new BcryptEncrypterProvider();
      },
      inject: [],
    },
    {
      provide: GetAccountUseCase,
      useFactory: (
        app: ApplicationService,
        accountRepository: AccountRepository,
        canGetAccountSpecification: CanGetAccountSpecification,
      ) => {
        return app.wrap(new GetAccountUseCase(accountRepository, canGetAccountSpecification));
      },
      inject: [ApplicationService, AccountRepository, CanGetAccountSpecification],
    },
    {
      provide: SetAccountPasswordUseCase,
      useFactory: (app: ApplicationService, accountRepository: AccountRepository, encrypterProvider: EncrypterProvider) => {
        return app.wrap(new SetAccountPasswordUseCase(accountRepository, encrypterProvider));
      },
      inject: [ApplicationService, AccountRepository, EncrypterProvider],
    },
    {
      provide: LoginAccountUseCase,
      useFactory: (
        app: ApplicationService,
        accountRepository: AccountRepository,
        encrypterProvider: EncrypterProvider,
        signableAccessTokenProvider: SignableAccessTokenProvider,
        signableRefreshTokenProvider: SignableRefreshTokenProvider,
      ) => {
        return app.wrap(
          new LoginAccountUseCase(
            accountRepository,
            encrypterProvider,
            signableAccessTokenProvider,
            signableRefreshTokenProvider,
          ),
        );
      },
      inject: [
        ApplicationService,
        AccountRepository,
        EncrypterProvider,
        SignableAccessTokenProvider,
        SignableRefreshTokenProvider,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        app: ApplicationService,
        signableAccessTokenProvider: SignableAccessTokenProvider,
        signableRefreshTokenProvider: SignableRefreshTokenProvider,
      ) => {
        return app.wrap(new RefreshTokenUseCase(signableAccessTokenProvider, signableRefreshTokenProvider));
      },
      inject: [ApplicationService, SignableAccessTokenProvider, SignableRefreshTokenProvider],
    },
  ],
  exports: [SetAccountPasswordUseCase],
})
export class AccountModule {}
