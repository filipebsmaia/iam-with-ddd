import crypto from 'crypto';
import { UseCase } from '@core/common/domain/use-case';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';
import { InvalidAccessTokenError } from '@core/common/infra/providers/errors/invalid-access-token.error';
import { InvalidRefreshTokenError } from '@core/common/infra/providers/errors/invalid-refresh-token.error';

interface RefreshTokenUseCaseProps {
  refreshToken: string;
  accessToken: string;
}

interface RefreshTokenUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase extends UseCase<RefreshTokenUseCaseProps, RefreshTokenUseCaseResponse> {
  constructor(
    private readonly accessTokenProvider: SignableAccessTokenProvider,
    private readonly refreshTokenProvider: SignableRefreshTokenProvider,
  ) {
    super();
  }

  async execute({ accessToken, refreshToken }: RefreshTokenUseCaseProps): Promise<RefreshTokenUseCaseResponse> {
    const accessTokenPayload = await this.accessTokenProvider.verify(accessToken);

    const refreshTokenPayload = await this.refreshTokenProvider.decode(refreshToken);

    if (!accessTokenPayload || !accessTokenPayload.id || !accessTokenPayload.accountId) {
      throw new InvalidAccessTokenError();
    }

    if (!refreshTokenPayload || !refreshTokenPayload.id) {
      throw new InvalidRefreshTokenError();
    }

    if (accessTokenPayload.id !== refreshTokenPayload.accessTokenId) {
      throw new InvalidRefreshTokenError();
    }

    const newAccessTokenId = crypto.randomUUID();

    const newAccessToken = await this.accessTokenProvider.sign({
      id: newAccessTokenId,
      accountId: accessTokenPayload.accountId,
    });

    const newRefreshToken = await this.refreshTokenProvider.sign({
      id: crypto.randomUUID(),
      accessTokenId: newAccessTokenId,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
