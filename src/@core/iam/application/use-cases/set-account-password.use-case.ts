import { UseCase } from '@core/common/domain/use-case';
import { AccountId } from '@core/iam/domain/entities/account.entity';
import HashedPassword from '@core/iam/domain/entities/value-objects/hashed-password.value-objet';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';

interface SetAccountPasswordUseCaseProps {
  accountId: string;
  password: string;
}

export class SetAccountPasswordUseCase extends UseCase<SetAccountPasswordUseCaseProps, void> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly encrypterProvider: EncrypterProvider,
  ) {
    super();
  }

  async execute({ accountId, password }: SetAccountPasswordUseCaseProps) {
    const account = await this.accountRepository.findById(new AccountId(accountId));

    if (!account) {
      throw new AccountNotFoundError();
    }

    const hashedPassword = new HashedPassword(await this.encrypterProvider.encrypt(password));

    account.changePassword(hashedPassword);
    await this.accountRepository.save(account);
  }
}
