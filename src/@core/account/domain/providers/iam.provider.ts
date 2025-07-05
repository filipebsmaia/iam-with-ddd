export interface IAMProviderHasPermissionPayload {
  accountId: string;
  permission: string;
}

export interface IAMProviderSetPermissionPayload {
  accountId: string;
  password: string;
}

export abstract class IAMProvider {
  abstract hasPermission(payload: IAMProviderHasPermissionPayload): Promise<boolean>;

  abstract setPassword(payload: IAMProviderSetPermissionPayload): Promise<void>;
  //
}
