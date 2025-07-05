import { UnauthorizedException } from '@core/common/exception/unauthorized.expection';

export class InvalidRefreshTokenError extends UnauthorizedException {
  constructor() {
    super(`The provided refresh token are invalid or expired`, 'common/invalid_refresh_token');
  }
}
