import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { Customer, CustomerId } from '@core/account/domain/entities/customer.entity';
import { CustomerRepository, FindCustomerBy } from '@core/account/domain/repositories/customer.repository';
import { CustomerPrismaMapper } from '@core/account/infra/db/mappers/customer-prisma.mapper';
import { UnitOfWork } from '@core/common/application/unit-of-work';

export class PrismaCustomerRepository extends CustomerRepository {
  constructor(
    private prismaManager: PrismaManager,
    private uow: UnitOfWork,
  ) {
    super();
  }

  get repository() {
    return this.prismaManager.client;
  }

  async create(entity: Customer): Promise<void> {
    const customer = CustomerPrismaMapper.toCreatePersistence(entity);

    await this.repository.customer.create({
      data: customer,
    });
  }

  async save(entity: Customer): Promise<void> {
    const customer = CustomerPrismaMapper.toUpdatePersistence(entity);

    await this.repository.customer.update({
      where: {
        id: customer.id,
      },
      data: customer,
    });
  }

  async findById(id: CustomerId): Promise<Customer | undefined> {
    const raw = await this.repository.customer.findUnique({
      where: { id: id.value },
      include: {
        account: true,
      },
    });

    if (raw) {
      return CustomerPrismaMapper.toDomain(raw);
    }
  }

  async findFirstBy(payload: FindCustomerBy): Promise<Customer | undefined> {
    const { email } = payload;

    const raw = await this.repository.customer.findFirst({
      where: {
        ...(email
          ? {
              account: {
                email: email.value,
              },
            }
          : {}),
      },
      include: {
        account: true,
      },
    });

    if (raw) {
      return CustomerPrismaMapper.toDomain(raw);
    }
  }
}
