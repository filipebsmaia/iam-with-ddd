import { UnwrappedValueObjectProps } from '@core/common/domain/value-objects/value-object';
import { Account } from '@core/iam/domain/entities/account.entity';

type SimplifiedAccount = Omit<Account, 'events' | 'hashedPassword' | 'credential'>;

export class AccountPresenter {
  static present({ id, type, roles }: SimplifiedAccount): UnwrappedValueObjectProps<SimplifiedAccount> {
    return {
      id: id.value,
      type,
      roles,
    };
  }
}
