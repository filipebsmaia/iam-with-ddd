export interface HasPermissionsProps {
  accountId: string;
  permissions: string[];
}

export abstract class AccountQuery {
  abstract hasPermissions(_: HasPermissionsProps): Promise<boolean>;
}
