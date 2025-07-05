import { sign, verify, SignOptions, JsonWebTokenError } from 'jsonwebtoken';
import { InvalidAccessTokenError } from './errors/invalid-access-token.error';
import {
  AccessTokenPayload,
  SignableAccessTokenProvider,
} from '@core/common/domain/providers/signable-access-token.provider';

export class JWTSignableAccessTokenProvider implements SignableAccessTokenProvider {
  async sign(payload: AccessTokenPayload): Promise<string> {
    const signed = sign(payload, process.env.AUTHENTICATION_ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.AUTHENTICATION_ACCESS_TOKEN_EXPIRES_IN! as SignOptions['expiresIn'],
    });

    return signed;
  }

  async verify(payload: string): Promise<AccessTokenPayload> {
    try {
      const data = verify(payload, process.env.AUTHENTICATION_ACCESS_TOKEN_SECRET!);
      return data as AccessTokenPayload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidAccessTokenError();
      }
      throw error;
    }
  }

  async decode(payload: string): Promise<AccessTokenPayload> {
    const data = verify(payload, process.env.AUTHENTICATION_ACCESS_TOKEN_SECRET!, { ignoreExpiration: true });
    return data as AccessTokenPayload;
  }
}
