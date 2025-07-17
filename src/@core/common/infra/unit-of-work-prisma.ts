import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { RunTransactionProps, UnitOfWork } from '@core/common/application/unit-of-work';

export class PrismaUnitOfWork extends UnitOfWork {
  constructor(private readonly prisma: PrismaManager) {
    super();
  }

  async runTransaction<T>({ isolation = 'required' }: RunTransactionProps, fn: () => Promise<T>): Promise<T> {
    return this.prisma.runTransaction({ isolation }, async () => {
      return await fn();
    });
  }
}
