import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { PermissionList } from './permission-list';

export class RoleId extends Uuid {}

export type RoleConstructorProps = {
  id?: RoleId;
  name: string;
  permissions: PermissionList;

  createdAt: Date;
  updatedAt: Date;
};

export type RoleCreateCommand = {
  id?: RoleId | string;
  name: string;
  permissions: PermissionList;

  createdAt: Date;
  updatedAt: Date;
};

export class Role extends AggregateRoot<RoleConstructorProps> {
  constructor({ id, name, permissions, createdAt, updatedAt }: RoleConstructorProps) {
    super({
      id: id ?? new RoleId(),
      name,
      permissions,
      createdAt,
      updatedAt,
    });
  }

  static create({ id, name, permissions, createdAt, updatedAt }: RoleCreateCommand) {
    const aggregate = new Role({
      id: typeof id === 'string' ? new RoleId(id) : (id ?? new RoleId()),
      name,
      permissions,
      createdAt,
      updatedAt,
    });
    return aggregate;
  }

  get name() {
    return this.props.name;
  }

  get permissions() {
    return this.props.permissions;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Role, 'events'>>, any> = {
      id: this.id.value,
      name: this.props.name,
      permissions: this.props.permissions.getItems().map((permission) => permission.toJSON()),
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
    return data;
  }
}
