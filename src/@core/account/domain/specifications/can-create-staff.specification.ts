import { Staff } from '@core/account/domain/entities/staff.entity';
import { IAMProvider } from '@core/account/domain/providers/iam.provider';
import { Specification } from '@core/common/domain/specification';

export class CanCreateStaffSpecification extends Specification<Staff> {
  constructor(readonly iamProvider: IAMProvider) {
    super();
  }

  async isSatisfiedBy(staff: Staff) {
    const hasPermission = await this.iamProvider.hasPermission({
      accountId: staff.accountId.value,
      permission: 'staff.create',
    });

    if (hasPermission) {
      return true;
    }

    return false;
  }
}
