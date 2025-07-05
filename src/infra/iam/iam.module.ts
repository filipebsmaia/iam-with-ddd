import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { SpecificationsModule } from './specifications.module';

@Module({
  imports: [AccountModule, SpecificationsModule],
  controllers: [],
  providers: [],
})
export class IAMModule {}
