import {
  IAMProvider,
  IAMProviderHasPermissionsPayload,
  IAMProviderSetPasswordPayload,
} from '@core/common/domain/providers/iam.provider';
import { AccountQuery } from '@core/iam/application/query/account.query';
import { SetAccountPasswordUseCase } from '@core/iam/application/use-cases/set-account-password.use-case';

export class DomainIAMProvider extends IAMProvider {
  constructor(
    private readonly setAccountPasswordUseCase: SetAccountPasswordUseCase,
    private readonly accountQuery: AccountQuery,
  ) {
    super();
  }

  async hasPermissions({ accountId, permissions }: IAMProviderHasPermissionsPayload): Promise<boolean> {
    return this.accountQuery.hasPermissions({ accountId, permissions });
  }

  async setPassword({ accountId, password }: IAMProviderSetPasswordPayload): Promise<void> {
    await this.setAccountPasswordUseCase.execute({
      accountId,
      password,
    });
  }
}
