import { UnwrappedValueObjectProps } from '@core/common/domain/value-objects/value-object';
import { Account } from '@core/iam/domain/entities/account.entity';

type SimplifiedAccount = Omit<Account, 'events' | 'hashedPassword' | 'credential'>;
export type AccountToPresent = UnwrappedValueObjectProps<SimplifiedAccount>;
export class AccountPresenter {
  static present({ id, type, roles }: SimplifiedAccount): AccountToPresent {
    return {
      id: id.value,
      type,
      roles,
    };
  }
}
