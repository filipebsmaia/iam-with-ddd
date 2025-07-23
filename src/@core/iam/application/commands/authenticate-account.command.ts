import { Command } from '@core/common/domain/command';
import Email from '@core/common/domain/value-objects/email.value-objet';
import { AccountType } from '@core/iam/domain/entities/account.entity';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';

interface AuthenticateAccountCommandProps {
  email: string;
  accountType: AccountType;
  password: string;
}

interface AuthenticateAccountCommandResponseProps {
  accountId: string;
}

export class AuthenticateAccountCommand extends Command<
  AuthenticateAccountCommandProps,
  AuthenticateAccountCommandResponseProps
> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly encrypterProvider: EncrypterProvider,
  ) {
    super();
  }

  async execute({
    accountType,
    email,
    password,
  }: AuthenticateAccountCommandProps): Promise<AuthenticateAccountCommandResponseProps> {
    const account = await this.accountRepository.findFirstBy({
      email: Email.from(email),
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

    return { accountId: account.id.value };
  }
}
