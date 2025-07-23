import { Staff } from '@core/account/domain/entities/staff.entity';
import { IAMProvider } from '@core/common/domain/providers/iam.provider';
import { Specification } from '@core/common/domain/specification';

export class CanCreateStaffSpecification extends Specification<Staff> {
  constructor(readonly iamProvider: IAMProvider) {
    super();
  }

  async isSatisfiedBy(staff: Staff) {
    const hasPermission = await this.iamProvider.hasPermissions({
      accountId: staff.accountId.value,
      permissions: ['staff.create'],
    });

    if (hasPermission) {
      return true;
    }

    return false;
  }
}
