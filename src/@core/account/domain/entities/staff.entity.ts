import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';

export class StaffId extends Uuid {}

export type StaffConstructorProps = {
  id?: StaffId;
  name: string;
  email: string;
  accountId: Uuid;

  createdAt: Date;
  updatedAt: Date;
};

export type StaffCreateCommand = {
  id?: StaffId | string;
  name: string;
  email: string;
  accountId?: Uuid;
};

export class Staff extends AggregateRoot<StaffConstructorProps> {
  constructor({ id, accountId, email, name, createdAt, updatedAt }: StaffConstructorProps) {
    super({
      id: id ?? new StaffId(),
      accountId,
      email,
      name,
      createdAt,
      updatedAt,
    });
  }

  static create({ id, accountId, email, name }: StaffCreateCommand) {
    const aggregate = new Staff({
      id: typeof id === 'string' ? new StaffId(id) : (id ?? new StaffId()),
      accountId: typeof accountId === 'string' ? new Uuid(accountId) : (accountId ?? new Uuid()),
      email,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return aggregate;
  }

  get accountId(): Uuid {
    return this.props.accountId;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Staff, 'events'>>, any> = {
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
