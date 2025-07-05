import { SignableTokenProvider } from './signable-token.provider';

export interface AccessTokenPayload {
  id: string;
  accountId: string;
}

export abstract class SignableAccessTokenProvider extends SignableTokenProvider<AccessTokenPayload> {
  //
}
