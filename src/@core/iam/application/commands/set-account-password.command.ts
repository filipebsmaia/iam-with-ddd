import { Command } from '@core/common/domain/command';
import { AccountId } from '@core/iam/domain/entities/account.entity';
import HashedPassword from '@core/iam/domain/entities/value-objects/hashed-password.value-objet';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';

interface SetAccountPasswordCommandProps {
  accountId: string;
  password: string;
}

export class SetAccountPasswordCommand extends Command<SetAccountPasswordCommandProps> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly encrypterProvider: EncrypterProvider,
  ) {
    super();
  }

  async execute({ accountId, password }: SetAccountPasswordCommandProps) {
    const targetAccountId = AccountId.from(accountId);
    const account = await this.accountRepository.findById(targetAccountId);

    if (!account) {
      throw new AccountNotFoundError();
    }

    const hashedPassword = new HashedPassword(await this.encrypterProvider.encrypt(password));

    account.changePassword(hashedPassword);
    await this.accountRepository.save(account);
  }
}
