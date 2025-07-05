import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';

export class PermissionId extends Uuid {}

export type PermissionConstructorProps = {
  id: PermissionId;
  value: string;
  assignedById: string;
};

export type PermissionCreateCommand = {
  id?: PermissionId | string;
  value: string;
  assignedById: string;
};

export class Permission extends AggregateRoot<PermissionConstructorProps> {
  constructor({ id, value, assignedById }: PermissionConstructorProps) {
    super({
      id,
      value,
      assignedById,
    });
  }

  static create({ id, value, assignedById }: PermissionCreateCommand) {
    const aggregate = new Permission({
      id: typeof id === 'string' ? new PermissionId(id) : (id ?? new PermissionId()),
      value,
      assignedById,
    });
    return aggregate;
  }

  get value() {
    return this.props.value;
  }

  get assignedById() {
    return this.props.assignedById;
  }

  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Permission, 'events'>>, any> = {
      id: this.id.value,
      value: this.props.value,
      assignedById: this.props.assignedById,
    };
    return data;
  }
}
