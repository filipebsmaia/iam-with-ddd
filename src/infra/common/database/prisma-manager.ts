import { OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

export interface RunTransactionProps {
  isolation: 'required' | 'none';
}
export class PrismaManager implements OnModuleInit {
  private readonly prisma = new PrismaClient();
  private asyncLocalStorage = new AsyncLocalStorage<Prisma.TransactionClient>();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get client(): Prisma.TransactionClient | PrismaClient {
    const txAsyncHook = this.asyncLocalStorage.getStore();

    return txAsyncHook ?? this.prisma;
  }

  // TODO: Move to UoW?
  async runTransaction<T>({ isolation }: RunTransactionProps, fn: () => Promise<T>): Promise<T> {
    const txAsyncHook = this.asyncLocalStorage.getStore();
    if (isolation === 'none' && txAsyncHook) {
      return this.asyncLocalStorage.run(txAsyncHook, async () => {
        const result = await fn();
        return result;
      });
    }
    // By default i want to have isolation
    return this.prisma.$transaction(async (tx) => {
      return this.asyncLocalStorage.run(tx, async () => {
        const result = await fn();
        return result;
      });
    });
  }
}
