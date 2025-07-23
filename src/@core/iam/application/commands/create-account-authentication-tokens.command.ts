import crypto from 'crypto';
import { Command } from '@core/common/domain/command';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';

interface CreateAccountAuthenticationTokensCommandProps {
  accountId: string;
}

interface CreateAccountAuthenticationsTokenCommandResponse {
  accessToken: string;
  refreshToken: string;
}

export class CreateAccountAuthenticationTokensCommand extends Command<
  CreateAccountAuthenticationTokensCommandProps,
  CreateAccountAuthenticationsTokenCommandResponse
> {
  constructor(
    private readonly accessTokenProvider: SignableAccessTokenProvider,
    private readonly refreshTokenProvider: SignableRefreshTokenProvider,
  ) {
    super();
  }

  async execute({ accountId }: CreateAccountAuthenticationTokensCommandProps) {
    const accessTokenId = crypto.randomUUID();
    const accessToken = await this.accessTokenProvider.sign({
      id: accessTokenId,
      accountId,
    });

    const refreshToken = await this.refreshTokenProvider.sign({
      id: crypto.randomUUID(),
      accessTokenId: accessTokenId,
    });

    return { accessToken, refreshToken };
  }
}
