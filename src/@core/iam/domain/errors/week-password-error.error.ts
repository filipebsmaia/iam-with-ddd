import { BadRequestException } from '@core/common/exception/bad-request.expection';

export class WeakPasswordError extends BadRequestException {
  constructor() {
    super(`The password you entered is too weak`, 'account/week_password');
  }
}
