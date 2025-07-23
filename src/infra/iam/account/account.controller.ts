import { Controller, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GetAccountParamsDTO } from './dtos/get-account.dto ';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';
import { ABAC } from '@/infra/common/application/guards/abac.decorator';
import { GetAccountQuery } from '@core/iam/application/queries/get-account.query';
import { AccountDTO } from '@core/iam/application/dtos/account.dto';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts')
export class AccountController {
  constructor(readonly getAccountQuery: GetAccountQuery) {}

  @ApiOperation({ summary: 'Get a account' })
  @IsAuthenticated({})
  @ApiResponse({
    type: () => AccountDTO,
  })
  @ABAC(['account.get'])
  @Post('/:accountId')
  async authenticateCustomer(@Req() { user }: Request, @Param() { accountId }: GetAccountParamsDTO): Promise<AccountDTO> {
    const account = await this.getAccountQuery.execute({
      accountId,
      executorId: user!.accountId,
    });

    return account;
  }
}
