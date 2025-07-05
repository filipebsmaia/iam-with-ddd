import { Repository } from '@core/common/domain/repository';
import { Staff, StaffId } from '@core/account/domain/entities/staff.entity';
import Email from '@core/common/domain/value-objects/email.value-objet';

export interface FindStaffBy {
  email?: Email;
}

export abstract class StaffRepository extends Repository<Staff> {
  abstract create(entity: Staff): Promise<void>;
  abstract findById(id: StaffId): Promise<Staff | undefined>;
  abstract findFirstBy(payload: FindStaffBy): Promise<Staff | undefined>;
  //
}
