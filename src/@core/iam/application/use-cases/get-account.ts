import { UseCase } from '@core/common/domain/use-case';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { Account, AccountId } from '@core/iam/domain/entities/account.entity';

interface GetAccountUseCaseProps {
  accountId: string;
  executorId: string;
}

export class GetAccountUseCase extends UseCase<GetAccountUseCaseProps, Account> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly canGetAccountSpecification: CanGetAccountSpecification,
  ) {
    super();
  }

  async execute({ accountId, executorId }: GetAccountUseCaseProps) {
    const executor = await this.accountRepository.findById(new AccountId(executorId));

    if (!executor) {
      throw new PermissionDeniedError();
    }

    if (!this.canGetAccountSpecification.isSatisfiedBy(executor)) {
      throw new PermissionDeniedError();
    }

    const account = await this.accountRepository.findById(new AccountId(accountId));

    if (!account) {
      throw new AccountNotFoundError();
    }

    return account;
  }
}
