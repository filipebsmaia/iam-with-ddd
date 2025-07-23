import { Module } from '@nestjs/common';
import { CanGetAccountSpecification } from '@core/iam/domain/specifications/can-get-account.specification';
import { IAMProvider } from '@core/common/domain/providers/iam.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: CanGetAccountSpecification,
      useFactory: (iamProvider: IAMProvider) => {
        return new CanGetAccountSpecification(iamProvider);
      },
      inject: [IAMProvider],
    },
  ],
  exports: [CanGetAccountSpecification],
})
export class SpecificationsModule {}
