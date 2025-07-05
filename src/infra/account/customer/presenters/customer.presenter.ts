import { Customer } from '@core/account/domain/entities/customer.entity';
import { UnwrappedValueObjectProps } from '@core/common/domain/value-objects/value-object';

export class CustomerPresenter {
  static present({
    id,
    accountId,
    email,
    name,
    createdAt,
    updatedAt,
  }: Customer): UnwrappedValueObjectProps<Omit<Customer, 'events'>> {
    return {
      id: id.value,
      accountId: accountId.value,
      email: email.value,
      name: name.value,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }
}
