import { WatchedList } from '@core/common/domain/watched-list';
import { Permission } from './permission.entity';

export class PermissionList extends WatchedList<Permission> {
  compareItems(a: Permission, b: Permission): boolean {
    return a.id.equals(b.id);
  }
}
