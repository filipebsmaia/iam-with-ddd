import { Repository } from '@core/common/domain/repository';
import { Customer, CustomerId } from '@core/account/domain/entities/customer.entity';
import Email from '@core/common/domain/value-objects/email.value-objet';

export interface FindCustomerBy {
  email?: Email;
}

export abstract class CustomerRepository extends Repository<Customer> {
  abstract create(entity: Customer): Promise<void>;
  abstract findById(id: CustomerId): Promise<Customer | undefined>;
  abstract findFirstBy(payload: FindCustomerBy): Promise<Customer | undefined>;
  //
}
