import { Staff, StaffId } from '@core/account/domain/entities/staff.entity';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { Prisma, Staff as PrismaStaff, Account as PrismaAccount, AccountType as PrismaAccountType } from '@prisma/client';

interface RawStaff extends PrismaStaff {
  account: PrismaAccount;
}

export class StaffPrismaMapper {
  static toDomain(raw: RawStaff): Staff {
    return new Staff({
      id: new StaffId(raw.id),
      email: raw.account.email,
      name: raw.name,
      accountId: new Uuid(raw.accountId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toCreatePersistence(aggregate: Staff): Prisma.StaffCreateInput {
    return {
      id: aggregate.id.value,
      account: {
        create: {
          id: aggregate.accountId.value,
          type: PrismaAccountType.STAFF,
          email: aggregate.email,
        },
      },
      name: aggregate.name,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }

  static toUpdatePersistence(aggregate: Staff): Omit<PrismaStaff, 'accountId'> & Prisma.StaffUpdateInput {
    return {
      id: aggregate.id.value,
      account: {
        update: {
          email: aggregate.email,
        },
      },
      name: aggregate.name,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
