import { AccountId } from '@core/iam/domain/entities/account.entity';
import { AccountDTO } from '../dtos/account.dto';
import { RoleDTO } from '../dtos/role.dto';

export interface HasPermissionsProps {
  accountId: AccountId;
  permissions: string[];
}

export interface GetRolesByAccountIdProps {
  accountId: AccountId;
}

export interface GetByAccountIdProps {
  accountId: AccountId;
}

export abstract class AccountQueryService {
  abstract hasPermissions(_: HasPermissionsProps): Promise<boolean>;
  abstract getRolesByAccountId(_: GetRolesByAccountIdProps): Promise<Array<RoleDTO>>;
  abstract getByAccountId(_: GetByAccountIdProps): Promise<AccountDTO>;
}
