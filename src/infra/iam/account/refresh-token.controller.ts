import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';
import { ValidateAccountTokensForRefreshCommand } from '@core/iam/application/commands/validate-account-tokens-for-refresh.command';
import { CreateAccountAuthenticationTokensCommand } from '@core/iam/application/commands/create-account-authentication-tokens.command';

@ApiTags('accounts')
@Controller('v1/accounts/authentication')
export class RefreshTokenController {
  constructor(
    private readonly validateAccountTokensForRefreshCommand: ValidateAccountTokensForRefreshCommand,
    private readonly createAccountAuthenticationTokensCommand: CreateAccountAuthenticationTokensCommand,
  ) {}

  @ApiOperation({ summary: 'Refresh access token for customer' })
  @Post('/refresh')
  @IsAuthenticated({ ignoreExpiration: true })
  async refreshCustomerToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const { accountId } = await this.validateAccountTokensForRefreshCommand.execute({
      accessToken: request.cookies?.Authorization ?? '',
      refreshToken: request.cookies?.RefreshAuthorization,
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
