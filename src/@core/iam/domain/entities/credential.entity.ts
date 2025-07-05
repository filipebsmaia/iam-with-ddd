import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import HashedPassword from './value-objects/hashed-password.value-objet';

export class CredentialId extends Uuid {}

export type CredentialConstructorProps = {
  id?: CredentialId;
  hashedPassword: HashedPassword;
};

export type CredentialCreateCommand = {
  id?: CredentialId | string;
  hashedPassword: HashedPassword | string;
};

export class Credential extends AggregateRoot<CredentialConstructorProps> {
  constructor({ id, hashedPassword }: CredentialConstructorProps) {
    super({
      id: id ?? new CredentialId(),
      hashedPassword,
    });
  }

  static create({ id, hashedPassword }: CredentialCreateCommand) {
    const aggregate = new Credential({
      id: typeof id === 'string' ? new CredentialId(id) : (id ?? new CredentialId()),
      hashedPassword: typeof hashedPassword === 'string' ? new HashedPassword(hashedPassword) : hashedPassword,
    });
    return aggregate;
  }

  changePassword(newHashedPassword: HashedPassword) {
    this.props.hashedPassword = newHashedPassword;
  }

  get hashedPassword(): HashedPassword {
    return this.props.hashedPassword;
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Credential, 'events'>>, any> = {
      id: this.id.value,
      hashedPassword: this.hashedPassword.value,
    };
    return data;
  }
}
