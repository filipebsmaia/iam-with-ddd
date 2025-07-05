import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Email from '@core/common/domain/value-objects/email.value-objet';
import Name from '@core/common/domain/value-objects/name.value-objet';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId;
  name: Name;
  email: Email;
  accountId: Uuid;

  createdAt: Date;
  updatedAt: Date;
};

export type CustomerCreateCommand = {
  id?: CustomerId | string;
  name: Name | string;
  email: Email | string;
  accountId?: Uuid;
};

export class Customer extends AggregateRoot<CustomerConstructorProps> {
  constructor({ id, accountId, email, name, createdAt, updatedAt }: CustomerConstructorProps) {
    super({
      id: id ?? new CustomerId(),
      accountId,
      email,
      name,
      createdAt,
      updatedAt,
    });
  }

  static create({ id, accountId, email, name }: CustomerCreateCommand) {
    const aggregate = new Customer({
      id: typeof id === 'string' ? new CustomerId(id) : (id ?? new CustomerId()),
      accountId: typeof accountId === 'string' ? new Uuid(accountId) : (accountId ?? new Uuid()),
      email: typeof email === 'string' ? new Email(email) : email,
      name: typeof name === 'string' ? new Name(name) : name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return aggregate;
  }

  get accountId(): Uuid {
    return this.props.accountId;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Customer, 'events'>>, any> = {
      id: this.id.value,
      accountId: this.accountId.value,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    return data;
  }
}
