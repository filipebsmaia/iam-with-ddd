import { Controller, Get, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GetAccountParamsDTO } from './dtos/get-account.dto ';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';
import { GetAccountRolesQuery } from '@core/iam/application/queries/get-account-roles.query';
import { RoleDTO } from '@core/iam/application/dtos/role.dto';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts/:accountId')
export class AccountRoleController {
  constructor(readonly getAccountRolesQuery: GetAccountRolesQuery) {}

  @ApiOperation({ summary: 'Get roles from account' })
  @ApiResponse({
    type: () => Array<RoleDTO>,
  })
  @IsAuthenticated({})
  @Get('/roles')
  async getAccountRoles(@Req() { user }: Request, @Param() { accountId }: GetAccountParamsDTO): Promise<Array<RoleDTO>> {
    const roles = await this.getAccountRolesQuery.execute({
      accountId,
      executorId: user!.accountId,
    });

    return roles;
  }
}
