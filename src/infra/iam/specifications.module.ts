import { Module } from '@nestjs/common';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: CanGetAccountSpecification,
      useFactory: () => {
        return new CanGetAccountSpecification();
      },
      inject: [],
    },
  ],
  exports: [CanGetAccountSpecification],
})
export class SpecificationsModule {}
