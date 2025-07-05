import { UnauthorizedException } from '@core/common/exception/unauthorized.expection';

export class UnauthorizedError extends UnauthorizedException {
  constructor() {
    super(`You are not authorized to access this resource`, 'common/unauthorized');
  }
}
