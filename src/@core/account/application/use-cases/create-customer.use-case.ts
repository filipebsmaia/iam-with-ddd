import { UseCase } from '@core/common/domain/use-case';
import { Customer } from '@core/account/domain/entities/customer.entity';
import { IAMProvider } from '@core/account/domain/providers/iam.provider';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { CustomerRepository } from '@core/account/domain/repositories/customer.repository';
import Email from '@core/common/domain/value-objects/email.value-objet';
import { CustomerAlreadyExistsError } from '@core/account/domain/errors/customer-already-exists.error';

interface CreateCustomerUseCaseProps {
  name: string;
  email: string;
  password: string;
}

export class CreateCustomerUseCase extends UseCase<CreateCustomerUseCaseProps, Customer> {
  constructor(
    readonly customerRepository: CustomerRepository,
    readonly iamProvider: IAMProvider,
    readonly uow: UnitOfWork,
  ) {
    super();
  }

  async execute({ name, email, password }: CreateCustomerUseCaseProps) {
    this.logger.info('Trying to create a new customer', { name, email });

    const customerAlreadyExists = await this.customerRepository.findFirstBy({
      email: new Email(email),
    });

    if (customerAlreadyExists) {
      this.logger.info('Customer already exists', { name, email });
      throw new CustomerAlreadyExistsError();
    }

    const customer = Customer.create({
      name,
      email,
    });

    this.logger.info('Creating customer', customer);

    await this.uow.runTransaction({}, async () => {
      await this.customerRepository.create(customer);
      await this.iamProvider.setPassword({
        accountId: customer.accountId.value,
        password,
      });
    });
    this.logger.info('Customer created', customer);

    return customer;
  }
}
