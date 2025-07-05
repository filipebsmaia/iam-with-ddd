export abstract class SignableTokenProvider<TokenPayload> {
  abstract sign(payload: TokenPayload): Promise<string>;
  abstract verify(payload: string): Promise<TokenPayload>;
  abstract decode(payload: string): Promise<TokenPayload>;
  //
}
