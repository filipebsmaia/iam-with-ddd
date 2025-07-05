import { WatchedList } from '@core/common/domain/watched-list';
import { RoleId } from './role.entity';

export class RoleIdList extends WatchedList<RoleId> {
  compareItems(a: RoleId, b: RoleId): boolean {
    return a.value === b.value;
  }
}
