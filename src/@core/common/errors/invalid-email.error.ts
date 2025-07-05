import { BadRequestException } from '@core/common/exception/bad-request.expection';

export class InvalidEmailError extends BadRequestException {
  constructor(invalidValue: any) {
    super(`Value ${invalidValue} must be a valid e-mail`, 'common/invalid_email');
  }
}
