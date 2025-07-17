import { UnwrappedValueObjectProps } from '@core/common/domain/value-objects/value-object';
import { Role } from '@core/iam/domain/entities/role.entity';
import { PermissionPresenter, PermissionToPresent } from './permission.presenter';

type SimplifiedRole = Omit<Role, 'events'>;
type RoleToPresent = UnwrappedValueObjectProps<Omit<SimplifiedRole, 'permissions'>> & {
  permissions: Array<PermissionToPresent>;
};

export class RolePresenter {
  static present({ id, name, permissions, createdAt, updatedAt }: SimplifiedRole): RoleToPresent {
    return {
      id: id.value,
      name,
      permissions: permissions.getItems().map(PermissionPresenter.present),
      createdAt,
      updatedAt,
    };
  }
}
