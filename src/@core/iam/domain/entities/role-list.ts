import { WatchedList } from '@core/common/domain/watched-list';
import { Role } from './role.entity';

export class RoleList extends WatchedList<Role> {
  compareItems(a: Role, b: Role): boolean {
    return a.id.equals(b.id);
  }
}
