import { sign, verify, SignOptions, JsonWebTokenError } from 'jsonwebtoken';
import { InvalidRefreshTokenError } from './errors/invalid-refresh-token.error';
import {
  RefreshTokenPayload,
  SignableRefreshTokenProvider,
} from '@core/common/domain/providers/signable-refresh-token.provider';
export class JWTSignableRefreshTokenProvider implements SignableRefreshTokenProvider {
  async sign(payload: RefreshTokenPayload): Promise<string> {
    const signed = sign(payload, process.env.AUTHENTICATION_REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES_IN! as SignOptions['expiresIn'],
    });

    return signed;
  }

  async verify(payload: string): Promise<RefreshTokenPayload> {
    try {
      const data = verify(payload, process.env.AUTHENTICATION_REFRESH_TOKEN_SECRET!);
      return data as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidRefreshTokenError();
      }
      throw error;
    }
  }

  async decode(payload: string): Promise<RefreshTokenPayload> {
    const data = verify(payload, process.env.AUTHENTICATION_REFRESH_TOKEN_SECRET!, { ignoreExpiration: true });

    return data as RefreshTokenPayload;
  }
}
