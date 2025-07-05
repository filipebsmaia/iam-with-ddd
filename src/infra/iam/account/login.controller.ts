import { LoginAccountUseCase } from '@core/iam/application/use-cases/login-account.use-case';
import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAccountBodyDTO } from './dtos/login-account.dto';
import { AccountType } from '@core/iam/domain/entities/account.entity';
import type { Response } from 'express';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts/authentication')
export class LoginController {
  constructor(readonly loginAccountUseCase: LoginAccountUseCase) {}

  @ApiOperation({ summary: 'Authenticate a customer' })
  @Post('/customers/login')
  async authenticateCustomer(
    @Res({ passthrough: true }) response: Response,
    @Body() { email, password }: LoginAccountBodyDTO,
  ) {
    const { accessToken, refreshToken } = await this.loginAccountUseCase.execute({
      accountType: AccountType.CUSTOMER,
      email,
      password,
    });

    response.cookie('RefreshAuthorization', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    response.cookie('Authorization', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
