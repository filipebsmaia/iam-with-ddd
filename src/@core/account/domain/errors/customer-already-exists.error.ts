import { ConflictException } from '@core/common/exception/conflict.expection';

export class CustomerAlreadyExistsError extends ConflictException {
  constructor() {
    super(`Customer already exists`, 'account/customer_already_exists');
  }
}
