import { PrismaManager } from '@/infra/common/database/prisma-manager';
import { AccountDTO } from '@core/iam/application/dtos/account.dto';
import { PermissionOnRoleDTO, RoleDTO } from '@core/iam/application/dtos/role.dto';
import {
  AccountQueryService,
  GetByAccountIdProps,
  GetRolesByAccountIdProps,
  HasPermissionsProps,
} from '@core/iam/application/services/account-query.service';
import { AccountNotFoundError } from '@core/iam/domain/errors/account-not-found.error';

export class PrismaAccountQueryService extends AccountQueryService {
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
              id: accountId.value,
            },
          },
        },
      },
      select: { permissionId: true },
    });

    return !!result;
  }

  async getRolesByAccountId({ accountId }: GetRolesByAccountIdProps): Promise<Array<RoleDTO>> {
    const raw = await this.repository.role.findMany({
      where: {
        accounts: {
          some: {
            id: accountId.value,
          },
        },
      },
      include: {
        permissionsOnRoles: {
          include: {
            permission: true,
          },
        },
      },
    });

    const data = raw.map((role): RoleDTO => {
      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.permissionsOnRoles.map((por): PermissionOnRoleDTO => {
          return {
            id: por.permissionId,
            assignedById: por.assignedById,
            value: por.permission.value,
          };
        }),
      };
    });

    return data;
  }

  async getByAccountId({ accountId }: GetByAccountIdProps): Promise<AccountDTO> {
    const raw = await this.repository.account.findUnique({
      where: {
        id: accountId.value,
      },
    });

    if (!raw) {
      throw new AccountNotFoundError();
    }

    const data: AccountDTO = {
      id: raw.id,
      type: raw.type,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return data;
  }
}
