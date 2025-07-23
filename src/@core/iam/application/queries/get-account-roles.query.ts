import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { AccountId } from '@core/iam/domain/entities/account.entity';
import { RoleRepository } from '@core/iam/domain/repositories/role.repository';
import { AccountQueryService } from '../services/account-query.service';
import { RoleDTO } from '../dtos/role.dto';
import { Query } from '@core/common/domain/query';

interface GetAccountRolesQueryProps {
  accountId: string;
  executorId: string;
}

export class GetAccountRolesQuery extends Query<GetAccountRolesQueryProps, Array<RoleDTO>> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly roleRepository: RoleRepository,
    readonly canGetAccountSpecification: CanGetAccountSpecification,
    readonly accountQueryService: AccountQueryService,
  ) {
    super();
  }

  async execute({ accountId, executorId }: GetAccountRolesQueryProps) {
    const targetAccountId = AccountId.from(accountId);
    const executorAccountId = AccountId.from(executorId);

    const executor = await this.accountRepository.findById(executorAccountId);

    if (!executor) {
      throw new PermissionDeniedError();
    }
    const targetAccountIsExecutorAccount = executor.id.equals(targetAccountId);
    const canGetAccount = this.canGetAccountSpecification.isSatisfiedBy(executor) || targetAccountIsExecutorAccount;

    if (!canGetAccount) {
      throw new PermissionDeniedError();
    }

    const roles = await this.accountQueryService.getRolesByAccountId({ accountId: targetAccountId });
    return roles;
  }
}
