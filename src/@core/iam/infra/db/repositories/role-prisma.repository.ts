import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { RoleRepository } from '@core/iam/domain/repositories/role.repository';
import { Role } from '@core/iam/domain/entities/role.entity';
import { RolePrismaMapper } from '../mappers/role-prisma.mapper';

export class PrismaRoleRepository extends RoleRepository {
  constructor(
    private prismaManager: PrismaManager,
    private uow: UnitOfWork,
  ) {
    super();
  }

  get repository() {
    return this.prismaManager.client;
  }

  async create(entity: Role): Promise<void> {
    const role = RolePrismaMapper.toPersistence(entity);

    await this.uow.runTransaction(async () => {
      await this.repository.role.create({
        data: {
          ...role,
        },
      });
    });
  }

  async save(entity: Role): Promise<void> {
    const role = RolePrismaMapper.toPersistence(entity);

    await this.uow.runTransaction(async () => {
      await this.repository.role.update({
        where: {
          id: role.id,
        },
        data: {
          ...role,
        },
      });
    });
  }
}
