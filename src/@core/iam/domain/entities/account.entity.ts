import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { Credential } from './credential.entity';
import HashedPassword from './value-objects/hashed-password.value-objet';
import { RoleIdList } from './role-id-list';

export const AccountType = {
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type AccountType = Enumerize<typeof AccountType>;

export class AccountId extends Uuid {}

export type AccountConstructorProps = {
  id: AccountId;
  type: AccountType;
  roles: RoleIdList;
  credential?: Credential;
};

export type AccountCreateCommand = {
  id?: AccountId | string;
  type: AccountType;
  roles?: RoleIdList;
  credential?: Credential;
};

export class Account extends AggregateRoot<AccountConstructorProps> {
  constructor({ id, type, roles, credential }: AccountConstructorProps) {
    super({
      id,
      type,
      roles,
      credential,
    });
  }

  static create({ id, type, roles, credential }: AccountCreateCommand) {
    const aggregate = new Account({
      id: typeof id === 'string' ? new AccountId(id) : (id ?? new AccountId()),
      type,
      roles: roles ?? new RoleIdList(),
      credential,
    });
    return aggregate;
  }

  get type() {
    return this.props.type;
  }

  get roles() {
    return this.props.roles;
  }

  get hashedPassword() {
    return this.props.credential?.hashedPassword;
  }

  get credential() {
    return this.props.credential;
  }

  public changePassword(hashedPassword: HashedPassword) {
    if (!this.props.credential) {
      this.props.credential = Credential.create({
        hashedPassword,
      });
    }
    this.props.credential.changePassword(hashedPassword);
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Account, 'events' | 'hashedPassword'>>, any> = {
      id: this.id.value,
      type: this.props.type,
      roles: this.props.roles.getItems(),
      credential: this.props.credential?.toJSON(),
    };
    return data;
  }
}
