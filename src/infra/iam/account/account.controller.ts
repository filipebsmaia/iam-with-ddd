import { Controller, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GetAccountUseCase } from '@core/iam/application/use-cases/get-account';
import { GetAccountParamsDTO } from './dtos/get-account.dto ';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';
import { ABAC } from '@/infra/common/application/guards/abac.decorator';
import { AccountPresenter } from './presenters/account.presenter';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts')
export class AccountController {
  constructor(readonly getAccountUseCase: GetAccountUseCase) {}

  @ApiOperation({ summary: 'Get a account' })
  @IsAuthenticated({})
  @ABAC(['account.get'])
  @Post('/:accountId')
  async authenticateCustomer(@Req() { user }: Request, @Param() { accountId }: GetAccountParamsDTO) {
    const account = await this.getAccountUseCase.execute({
      accountId,
      executorId: user!.accountId!,
    });

    return AccountPresenter.present(account);
  }
}
