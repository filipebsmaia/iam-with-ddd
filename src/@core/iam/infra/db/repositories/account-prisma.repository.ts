import { Account, AccountId } from '@core/iam/domain/entities/account.entity';
import { AccountPrismaMapper } from '../mappers/account-prisma.mapper';
import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { AccountRepository, FindAccountBy } from '@core/iam/domain/repositories/account.repository';

export class PrismaAccountRepository extends AccountRepository {
  private baseInclude = {
    credential: true,
    roles: {
      include: {
        permissionsOnRoles: {
          include: {
            permission: true,
          },
        },
      },
    },
  } as const;

  constructor(
    private prismaManager: PrismaManager,
    private uow: UnitOfWork,
  ) {
    super();
  }

  get repository() {
    return this.prismaManager.client;
  }

  async save(entity: Account): Promise<void> {
    const account = AccountPrismaMapper.toUpdatePersistence(entity);

    await this.repository.account.update({
      where: {
        id: entity.id.value,
      },
      data: account,
    });
  }

  async findById(id: AccountId): Promise<Account | undefined> {
    const raw = await this.repository.account.findUnique({
      where: { id: id.value },
      include: this.baseInclude,
    });

    if (raw) {
      return AccountPrismaMapper.toDomain(raw);
    }
  }

  async findFirstBy(payload: FindAccountBy): Promise<Account | undefined> {
    const { email, type } = payload;

    const raw = await this.repository.account.findFirst({
      where: {
        email: email?.value,
        type,
      },
      include: this.baseInclude,
    });

    if (raw) {
      return AccountPrismaMapper.toDomain(raw);
    }
  }
}
