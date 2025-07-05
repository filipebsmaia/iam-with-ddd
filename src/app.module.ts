import { Module } from '@nestjs/common';
import { AccountModule } from './infra/account/account.module';
import { CommonModule } from './infra/common/common.module';
import { IAMModule } from './infra/iam/iam.module';

@Module({
  imports: [CommonModule, AccountModule, IAMModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
