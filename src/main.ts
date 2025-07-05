import './telemetry';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@core/common/application/logger';
import { AppModule } from './app.module';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { ValidationError, ValidationErrorProperties } from '@core/common/errors/validation.error';
import cookieParser from 'cookie-parser';

class NestLogger implements LoggerService {
  private readonly logger = new Logger();
  constructor() {}

  log(message: any, extra: any) {
    this.logger.info(message, extra);
  }

  error(message: any, extra: any) {
    this.logger.error(message, extra);
  }

  warn(message: any, extra: any) {
    this.logger.warn(message, extra);
  }

  debug?(message: any, extra: any) {
    this.logger.debug(message, extra);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new NestLogger());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors
          .map(({ property, constraints }) => {
            if (!constraints) {
              return;
            }
            const keys = Object.keys(constraints);
            const message = constraints[keys[0]];
            return {
              property,
              message,
            };
          })
          .filter(Boolean) as ValidationErrorProperties;

        return new ValidationError(result);
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();

// import { PrismaUnitOfWork } from "@core/common/infra/unit-of-work-prisma";
// import { PrismaManager } from "./database/prisma-manager";
// import { randomUUID } from 'crypto'

// const e = async () => {
//   const prismaProvider = new PrismaManager();
//   const uow = new PrismaUnitOfWork(prismaProvider);

//   console.log({ antes: Object.keys(prismaProvider.getClient())})
//   await prismaProvider.onModuleInit();
//   console.log('Connected');
//   console.log({ con: Object.keys(prismaProvider.getClient())})

//   uow.runTransaction(async () => {
//     let db = prismaProvider.getClient();
//   })
// }
// e();

// prismaProvider.onModuleDestroy();
// const err = () => {
//   throw new Error();
// }
// const a = () => {

//   uow.runTransaction(async () => {
//     let db = prismaProvider.client;

//     const recurring = await db.recurring.create({
//       data: {
//         id: randomUUID(),
//         individualId: randomUUID(),
//         maxAttempts: 3,
//         organizationId: randomUUID(),
//         status: 'SCHEDULED',
//         totalAttempts: 0,
//       }
//     })
//     console.log('Recurring', recurring)

//     await uow.runTransaction(async () => {});

//     await db.recurring.update({
//       where: {
//         id: recurring.id
//       },
//       data: {
//         totalAttempts: 1
//       }
//     })
//     err();

//   })
// }
// a();
