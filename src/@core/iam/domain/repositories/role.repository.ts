import { Repository } from '@core/common/domain/repository';
import { Role, RoleId } from '@core/iam/domain/entities/role.entity';

export abstract class RoleRepository extends Repository<Role> {
  abstract findById(id: RoleId): Promise<Role | undefined>;
  //
}
