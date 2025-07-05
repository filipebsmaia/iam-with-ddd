import { Specification } from '@core/common/domain/specification';
import { Account } from '@core/iam/domain/entities/account.entity';

export class CanGetAccountSpecification extends Specification<Account> {
  constructor() {
    super();
  }

  async isSatisfiedBy(_account: Account) {
    // TODO: Find on DB
    return true;
  }
}
