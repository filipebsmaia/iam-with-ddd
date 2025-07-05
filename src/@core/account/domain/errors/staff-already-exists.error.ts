import { ConflictException } from '@core/common/exception/conflict.expection';

export class StaffAlreadyExistsError extends ConflictException {
  constructor() {
    super(`Staff already exists`, 'account/staf_already_exists');
  }
}
