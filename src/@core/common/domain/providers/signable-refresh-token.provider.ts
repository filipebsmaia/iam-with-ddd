import { SignableTokenProvider } from './signable-token.provider';

export interface RefreshTokenPayload {
  id: string;
  accessTokenId: string;
}

export abstract class SignableRefreshTokenProvider extends SignableTokenProvider<RefreshTokenPayload> {
  //
}
