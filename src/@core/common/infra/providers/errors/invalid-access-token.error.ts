import { UnauthorizedException } from '@core/common/exception/unauthorized.expection';

export class InvalidAccessTokenError extends UnauthorizedException {
  constructor() {
    super(`The provided access token are invalid or expired`, 'common/invalid_access_token');
  }
}
