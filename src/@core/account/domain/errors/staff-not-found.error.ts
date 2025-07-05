import { BadRequestException } from '@core/common/exception/bad-request.expection';

export class StaffNotFoundError extends BadRequestException {
  constructor() {
    super(`Staff not found`, 'account/staff_not_found');
  }
}
