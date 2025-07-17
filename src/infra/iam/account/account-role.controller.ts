import { Controller, Get, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GetAccountParamsDTO } from './dtos/get-account.dto ';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';
import { ABAC } from '@/infra/common/application/guards/abac.decorator';
import { GetAccountRolesUseCase } from '@core/iam/application/use-cases/get-account-roles';
import { RolePresenter } from './presenters/role.presenter';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts/:accountId')
export class AccountRoleController {
  constructor(readonly getAccountRolesUseCase: GetAccountRolesUseCase) {}

  @ApiOperation({ summary: 'Get a account role' })
  @IsAuthenticated({})
  @ABAC(['account.get'])
  @Get('/roles')
  async authenticateCustomer(@Req() { user }: Request, @Param() { accountId }: GetAccountParamsDTO) {
    const roles = await this.getAccountRolesUseCase.execute({
      accountId,
      executorId: user!.accountId!,
    });

    return roles.map(RolePresenter.present);
  }
}
