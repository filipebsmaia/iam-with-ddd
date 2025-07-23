import { IAMProvider } from '@core/common/domain/providers/iam.provider';
import { Specification } from '@core/common/domain/specification';
import { Account } from '@core/iam/domain/entities/account.entity';

export class CanGetAccountSpecification extends Specification<Account> {
  constructor(readonly iamProvider: IAMProvider) {
    super();
  }

  async isSatisfiedBy(account: Account) {
    const hasPermission = await this.iamProvider.hasPermissions({
      accountId: account.id.value,
      permissions: ['staff.create'],
    });

    if (hasPermission) {
      return true;
    }

    return false;
  }
}
