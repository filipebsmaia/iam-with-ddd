import { Repository } from '@core/common/domain/repository';
import Email from '@core/common/domain/value-objects/email.value-objet';
import { Account, AccountId, AccountType } from '@core/iam/domain/entities/account.entity';

export interface FindAccountBy {
  email?: Email;
  type?: AccountType;
}
export abstract class AccountRepository extends Repository<Account> {
  abstract findById(id: AccountId): Promise<Account | undefined>;
  abstract findFirstBy(payload: FindAccountBy): Promise<Account | undefined>;
  //
}
