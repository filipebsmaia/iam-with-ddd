import {
  IAMProvider,
  IAMProviderHasPermissionsPayload,
  IAMProviderSetPasswordPayload,
} from '@core/common/domain/providers/iam.provider';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { SetAccountPasswordCommand } from '@core/iam/application/commands/set-account-password.command';
import { AccountQueryService } from '@core/iam/application/services/account-query.service';

export class DomainIAMProvider extends IAMProvider {
  constructor(
    private readonly setAccountPasswordCommand: SetAccountPasswordCommand,
    private readonly accountQueryService: AccountQueryService,
  ) {
    super();
  }

  async hasPermissions({ accountId, permissions }: IAMProviderHasPermissionsPayload): Promise<boolean> {
    return this.accountQueryService.hasPermissions({ accountId: Uuid.from(accountId), permissions });
  }

  async setPassword({ accountId, password }: IAMProviderSetPasswordPayload): Promise<void> {
    await this.setAccountPasswordCommand.execute({
      accountId,
      password,
    });
  }
}
