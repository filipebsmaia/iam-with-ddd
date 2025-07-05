import { Customer, CustomerId } from '@core/account/domain/entities/customer.entity';
import Email from '@core/common/domain/value-objects/email.value-objet';
import Name from '@core/common/domain/value-objects/name.value-objet';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import {
  Prisma,
  Customer as PrismaCustomer,
  Account as PrismaAccount,
  AccountType as PrismaAccountType,
} from '@prisma/client';

interface RawCustomer extends PrismaCustomer {
  account: PrismaAccount;
  //
}

export class CustomerPrismaMapper {
  static toDomain(raw: RawCustomer): Customer {
    return new Customer({
      id: new CustomerId(raw.id),
      email: new Email(raw.account.email),
      name: new Name(raw.name),
      accountId: new Uuid(raw.accountId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toCreatePersistence(aggregate: Customer): Prisma.CustomerCreateInput {
    return {
      id: aggregate.id.value,
      account: {
        create: {
          id: aggregate.accountId.value,
          type: PrismaAccountType.CUSTOMER,
          email: aggregate.email.value,
        },
      },
      name: aggregate.name.value,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }

  static toUpdatePersistence(aggregate: Customer): Omit<PrismaCustomer, 'accountId'> & Prisma.CustomerUpdateInput {
    return {
      id: aggregate.id.value,
      account: {
        update: {
          email: aggregate.email.value,
        },
      },
      name: aggregate.name.value,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
