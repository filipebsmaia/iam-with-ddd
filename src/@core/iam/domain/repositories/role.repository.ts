import { Repository } from '@core/common/domain/repository';
import { Role } from '@core/iam/domain/entities/role.entity';

export abstract class RoleRepository extends Repository<Role> {
  //
}
