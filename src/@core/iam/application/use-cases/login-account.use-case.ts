import crypto from 'crypto';
import { UseCase } from '@core/common/domain/use-case';
import Email from '@core/common/domain/value-objects/email.value-objet';
import { AccountType } from '@core/iam/domain/entities/account.entity';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';

interface LoginAccountUseCaseProps {
  email: string;
  accountType: AccountType;
  password: string;
}

interface LoginAccountUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

export class LoginAccountUseCase extends UseCase<LoginAccountUseCaseProps, LoginAccountUseCaseResponse> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly encrypterProvider: EncrypterProvider,
    readonly accessTokenProvider: SignableAccessTokenProvider,
    readonly refreshTokenProvider: SignableRefreshTokenProvider,
  ) {
    super();
  }

  async execute({ accountType, email, password }: LoginAccountUseCaseProps) {
    const account = await this.accountRepository.findFirstBy({
      email: new Email(email),
      type: accountType,
    });

    if (!account || !account.hashedPassword) {
      throw new AccountNotFoundError();
    }

    const isSamePassword = await this.encrypterProvider.compare({
      hash: account.hashedPassword.value,
      plain: password,
    });

    if (!isSamePassword) {
      throw new AccountNotFoundError();
    }

    const accessTokenId = crypto.randomUUID();
    const accessToken = await this.accessTokenProvider.sign({
      id: accessTokenId,
      accountId: account.id.value,
    });

    const refreshToken = await this.refreshTokenProvider.sign({
      id: crypto.randomUUID(),
      accessTokenId: accessTokenId,
    });

    return { accessToken, refreshToken };
  }
}
