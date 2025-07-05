import { BadRequestException } from '@core/common/exception/bad-request.expection';

export class AccountNotFoundError extends BadRequestException {
  constructor() {
    super(`Account not found`, 'account/account_not_found');
  }
}
