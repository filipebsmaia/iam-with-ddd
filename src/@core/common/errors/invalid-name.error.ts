import { BadRequestException } from '@core/common/exception/bad-request.expection';

export class InvalidNameError extends BadRequestException {
  constructor(invalidValue: any) {
    super(`Value ${invalidValue} must be a valid name`, 'common/invalid_name');
  }
}
