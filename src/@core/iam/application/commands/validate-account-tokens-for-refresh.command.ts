import { Command } from '@core/common/domain/command';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';
import { InvalidAccessTokenError } from '@core/common/infra/providers/errors/invalid-access-token.error';
import { InvalidRefreshTokenError } from '@core/common/infra/providers/errors/invalid-refresh-token.error';

interface ValidateAccountTokensForRefreshCommandProps {
  refreshToken: string;
  accessToken: string;
}
interface ValidateAccountTokensForRefreshCommandResponseProps {
  accountId: string;
}

export class ValidateAccountTokensForRefreshCommand extends Command<
  ValidateAccountTokensForRefreshCommandProps,
  ValidateAccountTokensForRefreshCommandResponseProps
> {
  constructor(
    private readonly accessTokenProvider: SignableAccessTokenProvider,
    private readonly refreshTokenProvider: SignableRefreshTokenProvider,
  ) {
    super();
  }

  async execute({
    accessToken,
    refreshToken,
  }: ValidateAccountTokensForRefreshCommandProps): Promise<ValidateAccountTokensForRefreshCommandResponseProps> {
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

    return { accountId: accessTokenPayload.accountId };
  }
}
