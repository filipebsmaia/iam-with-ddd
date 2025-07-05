import { UseCase } from '@core/common/domain/use-case';
import { CanCreateStaffSpecification } from '@core/account/domain/specifications/can-create-staff.specification';
import { Staff, StaffId } from '@core/account/domain/entities/staff.entity';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { StaffRepository } from '@core/account/domain/repositories/staff.repository';
import Email from '@core/common/domain/value-objects/email.value-objet';
import { StaffAlreadyExistsError } from '@core/account/domain/errors/staff-already-exists.error';

interface CreateStaffUseCaseProps {
  executorId: string;
  name: string;
  email: string;
}

export class CreateStaffUseCase extends UseCase<CreateStaffUseCaseProps, void> {
  constructor(
    readonly staffRepository: StaffRepository,
    readonly canCreateStaffSpecification: CanCreateStaffSpecification,
  ) {
    super();
  }

  async execute({ executorId, name, email }: CreateStaffUseCaseProps) {
    const executor = await this.staffRepository.findById(new StaffId(executorId));

    if (!executor) {
      throw new PermissionDeniedError();
    }

    if (!this.canCreateStaffSpecification.isSatisfiedBy(executor)) {
      throw new PermissionDeniedError();
    }

    const staffAlreadyExists = await this.staffRepository.findFirstBy({
      email: new Email(email),
    });

    if (staffAlreadyExists) {
      throw new StaffAlreadyExistsError();
    }

    const staff = Staff.create({
      name,
      email,
    });

    await this.staffRepository.create(staff);
  }
}
