import { UseCase } from '@core/common/domain/use-case';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';
import { AccountRepository } from '@core/iam/domain/repositories/account.repository';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { AccountId } from '@core/iam/domain/entities/account.entity';
import { RoleRepository } from '@core/iam/domain/repositories/role.repository';
import { Role } from '@core/iam/domain/entities/role.entity';

interface GetAccountRolesUseCaseProps {
  accountId: string;
  executorId: string;
}

export class GetAccountRolesUseCase extends UseCase<GetAccountRolesUseCaseProps, Array<Role>> {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly roleRepository: RoleRepository,
    readonly canGetAccountSpecification: CanGetAccountSpecification,
  ) {
    super();
  }

  async execute({ accountId, executorId }: GetAccountRolesUseCaseProps) {
    const executor = await this.accountRepository.findById(AccountId.from(executorId));

    if (!executor) {
      throw new PermissionDeniedError();
    }

    const targetAccountIsExecutorAccount = executor.id.equals(AccountId.from(accountId));
    const canGetAccount = this.canGetAccountSpecification.isSatisfiedBy(executor) || targetAccountIsExecutorAccount;

    if (!canGetAccount) {
      throw new PermissionDeniedError();
    }

    const account = await this.accountRepository.findById(AccountId.from(accountId));

    if (!account) {
      throw new AccountNotFoundError();
    }

    const roles = await Promise.all(
      account.roles.getItems().map(async (roleId) => {
        return this.roleRepository.findById(roleId);
      }),
    );

    const filteredRoles = roles.filter(Boolean) as Array<Role>;

    return filteredRoles;
  }
}
