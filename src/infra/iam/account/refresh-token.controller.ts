import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { RefreshTokenUseCase } from '@core/iam/application/use-cases/refresh-token.use-case';
import { IsAuthenticated } from '@/infra/common/application/guards/is-autneticated.decorator';

@ApiTags('accounts')
@Controller('v1/accounts/authentication')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @ApiOperation({ summary: 'Refresh access token for customer' })
  @Post('/refresh')
  @IsAuthenticated({ ignoreExpiration: true })
  async refreshCustomerToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken } = await this.refreshTokenUseCase.execute({
      accessToken: request.cookies?.Authorization ?? '',
      refreshToken: request.cookies?.RefreshAuthorization,
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
