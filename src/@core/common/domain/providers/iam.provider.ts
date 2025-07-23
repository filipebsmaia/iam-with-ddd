export interface IAMProviderHasPermissionsPayload {
  accountId: string;
  permissions: Array<string>;
}

export interface IAMProviderSetPasswordPayload {
  accountId: string;
  password: string;
}

export abstract class IAMProvider {
  abstract hasPermissions(payload: IAMProviderHasPermissionsPayload): Promise<boolean>;

  abstract setPassword(payload: IAMProviderSetPasswordPayload): Promise<void>;
  //
}
