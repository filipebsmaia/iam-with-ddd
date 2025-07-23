import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { AccountQuery, HasPermissionsProps } from '@core/iam/application/query/account.query';

export class PrismaAccountQuery extends AccountQuery {
  constructor(private prismaManager: PrismaManager) {
    super();
  }

  get repository() {
    return this.prismaManager.client;
  }

  async hasPermissions({ accountId, permissions }: HasPermissionsProps): Promise<boolean> {
    const result = await this.repository.permissionsOnRoles.findFirst({
      where: {
        permission: {
          value: {
            in: permissions,
          },
        },
        role: {
          accounts: {
            some: {
              id: accountId,
            },
          },
        },
      },
      select: { permissionId: true },
    });

    return !!result;
  }
}
