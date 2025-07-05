import { Staff, StaffId } from '@core/account/domain/entities/staff.entity';
import { FindStaffBy, StaffRepository } from '@core/account/domain/repositories/staff.repository';
import { StaffPrismaMapper } from '@core/account/infra/db/mappers/staff-prisma.mapper';
import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { UnitOfWork } from '@core/common/application/unit-of-work';

export class PrismaStaffRepository extends StaffRepository {
  constructor(
    private prismaManager: PrismaManager,
    private uow: UnitOfWork,
  ) {
    super();
  }

  get repository() {
    return this.prismaManager.client;
  }

  async create(entity: Staff): Promise<void> {
    const staff = StaffPrismaMapper.toCreatePersistence(entity);

    await this.repository.staff.create({
      data: staff,
    });
  }

  async save(entity: Staff): Promise<void> {
    const staff = StaffPrismaMapper.toUpdatePersistence(entity);

    await this.repository.staff.update({
      where: {
        id: staff.id,
      },
      data: staff,
    });
  }

  async findById(id: StaffId): Promise<Staff | undefined> {
    const raw = await this.repository.staff.findUnique({
      where: { id: id.value },
      include: {
        account: true,
      },
    });

    if (raw) {
      return StaffPrismaMapper.toDomain(raw);
    }
  }

  async findFirstBy(payload: FindStaffBy): Promise<Staff | undefined> {
    const { email } = payload;

    const raw = await this.repository.customer.findFirst({
      where: {
        account: {
          email: email?.value,
        },
      },
      include: {
        account: true,
      },
    });

    if (raw) {
      return StaffPrismaMapper.toDomain(raw);
    }
  }
}
