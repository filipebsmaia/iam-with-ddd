import { Query } from '@core/common/domain/query';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { AccountId } from '@core/iam/domain/entities/account.entity';
import { AccountQueryService } from '../services/account-query.service';
import { AccountDTO } from '../dtos/account.dto';

interface GetAccountQueryProps {
  accountId: string;
  executorId: string;
}

export class GetAccountQuery extends Query<GetAccountQueryProps, AccountDTO> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly canGetAccountSpecification: CanGetAccountSpecification,
    readonly accountQueryService: AccountQueryService,
  ) {
    super();
  }

  async execute({ accountId, executorId }: GetAccountQueryProps) {
    const targetAccountId = AccountId.from(accountId);
    const executorAccountId = AccountId.from(executorId);
    const executor = await this.accountRepository.findById(executorAccountId);

    if (!executor) {
      throw new PermissionDeniedError();
    }

    if (!this.canGetAccountSpecification.isSatisfiedBy(executor)) {
      throw new PermissionDeniedError();
    }

    const account = await this.accountQueryService.getByAccountId({ accountId: targetAccountId });

    return account;
  }
}
