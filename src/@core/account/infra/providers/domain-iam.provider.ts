import {
  IAMProvider,
  IAMProviderHasPermissionPayload,
  IAMProviderSetPermissionPayload,
} from '@core/account/domain/providers/iam.provider';
import { SetAccountPasswordUseCase } from '@core/iam/application/use-cases/set-account-password.use-case';

export class DomainIAMProvider extends IAMProvider {
  constructor(readonly setAccountPasswordUseCase: SetAccountPasswordUseCase) {
    super();
  }

  async hasPermission(_: IAMProviderHasPermissionPayload): Promise<boolean> {
    return true;
  }

  async setPassword({ accountId, password }: IAMProviderSetPermissionPayload): Promise<void> {
    await this.setAccountPasswordUseCase.execute({
      accountId,
      password,
    });
  }
}
