import { Module } from '@nestjs/common';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { ApplicationService } from '@core/common/application/application.service';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { RoleRepository } from '@core/iam/domain/repositories/role.repository';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { BcryptEncrypterProvider } from '@core/iam/infra/providers/bcrypt-encrypter.provider';
import { LoginController } from './login.controller';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';
import { RefreshTokenController } from './refresh-token.controller';
import { SignableTokenModule } from './signable-token.module';
import { AccountController } from './account.controller';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { SpecificationsModule } from '../specifications.module';
import { AccountRoleController } from './account-role.controller';
import { PrismaAccountRepository } from '@core/iam/infra/db/repositories/prisma-account.repository';
import { AccountQueryService } from '@core/iam/application/services/account-query.service';
import { PrismaAccountQueryService } from '@core/iam/infra/db/query/prisma-account-query.service';
import { GetAccountQuery } from '@core/iam/application/queries/get-account.query';
import { GetAccountRolesQuery } from '@core/iam/application/queries/get-account-roles.query';
import { SetAccountPasswordCommand } from '@core/iam/application/commands/set-account-password.command';
import { PrismaRoleRepository } from '@core/iam/infra/db/repositories/prisma-role.repository';
import { AuthenticateAccountCommand } from '@core/iam/application/commands/authenticate-account.command';
import { ValidateAccountTokensForRefreshCommand } from '@core/iam/application/commands/validate-account-tokens-for-refresh.command';
import { CreateAccountAuthenticationTokensCommand } from '@core/iam/application/commands/create-account-authentication-tokens.command';

@Module({
  imports: [SignableTokenModule, SpecificationsModule],
  controllers: [LoginController, RefreshTokenController, AccountController, AccountRoleController],
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
      provide: AccountQueryService,
      useFactory: (prismaManager: PrismaManager) => {
        return new PrismaAccountQueryService(prismaManager);
      },
      inject: [PrismaManager],
    },
    {
      provide: EncrypterProvider,
      useFactory: () => {
        return new BcryptEncrypterProvider();
      },
      inject: [],
    },
    {
      provide: GetAccountQuery,
      useFactory: (
        app: ApplicationService,
        accountRepository: AccountRepository,
        canGetAccountSpecification: CanGetAccountSpecification,
        accountQueryService: AccountQueryService,
      ) => {
        return app.wrap(new GetAccountQuery(accountRepository, canGetAccountSpecification, accountQueryService));
      },
      inject: [ApplicationService, AccountRepository, CanGetAccountSpecification, AccountQueryService],
    },
    {
      provide: GetAccountRolesQuery,
      useFactory: (
        app: ApplicationService,
        roleRepository: RoleRepository,
        accountRepository: AccountRepository,
        canGetAccountSpecification: CanGetAccountSpecification,
        accountQueryService: AccountQueryService,
      ) => {
        return app.wrap(
          new GetAccountRolesQuery(accountRepository, roleRepository, canGetAccountSpecification, accountQueryService),
        );
      },
      inject: [ApplicationService, RoleRepository, AccountRepository, CanGetAccountSpecification, AccountQueryService],
    },
    {
      provide: SetAccountPasswordCommand,
      useFactory: (app: ApplicationService, accountRepository: AccountRepository, encrypterProvider: EncrypterProvider) => {
        return app.wrap(new SetAccountPasswordCommand(accountRepository, encrypterProvider));
      },
      inject: [ApplicationService, AccountRepository, EncrypterProvider],
    },
    {
      provide: ValidateAccountTokensForRefreshCommand,
      useFactory: (
        app: ApplicationService,
        signableAccessTokenProvider: SignableAccessTokenProvider,
        signableRefreshTokenProvider: SignableRefreshTokenProvider,
      ) => {
        return app.wrap(
          new ValidateAccountTokensForRefreshCommand(signableAccessTokenProvider, signableRefreshTokenProvider),
        );
      },
      inject: [ApplicationService, SignableAccessTokenProvider, SignableRefreshTokenProvider],
    },
    {
      provide: AuthenticateAccountCommand,
      useFactory: (app: ApplicationService, accountRepository: AccountRepository, encrypterProvider: EncrypterProvider) => {
        return app.wrap(new AuthenticateAccountCommand(accountRepository, encrypterProvider));
      },
      inject: [ApplicationService, AccountRepository, EncrypterProvider],
    },
    {
      provide: CreateAccountAuthenticationTokensCommand,
      useFactory: (
        app: ApplicationService,
        signableAccessTokenProvider: SignableAccessTokenProvider,
        signableRefreshTokenProvider: SignableRefreshTokenProvider,
      ) => {
        return app.wrap(
          new CreateAccountAuthenticationTokensCommand(signableAccessTokenProvider, signableRefreshTokenProvider),
        );
      },
      inject: [ApplicationService, SignableAccessTokenProvider, SignableRefreshTokenProvider],
    },
  ],
  exports: [SetAccountPasswordCommand, AccountQueryService],
})
export class AccountModule {}
