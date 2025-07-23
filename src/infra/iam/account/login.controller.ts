import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAccountBodyDTO } from './dtos/login-account.dto';
import { AccountType } from '@core/iam/domain/entities/account.entity';
import type { Response } from 'express';
import { AuthenticateAccountCommand } from '@core/iam/application/commands/authenticate-account.command';
import { CreateAccountAuthenticationTokensCommand } from '@core/iam/application/commands/create-account-authentication-tokens.command';

@UsePipes(new ValidationPipe())
@ApiTags('accounts')
@Controller('v1/accounts/authentication')
export class LoginController {
  constructor(
    private readonly authenticateAccountCommand: AuthenticateAccountCommand,
    private readonly createAccountAuthenticationTokensCommand: CreateAccountAuthenticationTokensCommand,
  ) {}

  @ApiOperation({ summary: 'Authenticate a customer' })
  @Post('/customers/login')
  async authenticateCustomer(
    @Res({ passthrough: true }) response: Response,
    @Body() { email, password }: LoginAccountBodyDTO,
  ) {
    const { accountId } = await this.authenticateAccountCommand.execute({
      accountType: AccountType.CUSTOMER,
      email,
      password,
    });

    const { accessToken, refreshToken } = await this.createAccountAuthenticationTokensCommand.execute({
      accountId,
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
