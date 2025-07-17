import { UnwrappedValueObjectProps } from '@core/common/domain/value-objects/value-object';
import { Permission } from '@core/iam/domain/entities/permission.entity';

type SimplifiedPermission = Omit<Permission, 'events'>;
export type PermissionToPresent = UnwrappedValueObjectProps<SimplifiedPermission>;

export class PermissionPresenter {
  static present({ id, assignedById, value }: SimplifiedPermission): PermissionToPresent {
    return {
      id: id.value,
      assignedById: assignedById,
      value,
    };
  }
}
