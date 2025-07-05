import { PermissionList } from '@core/iam/domain/entities/permission-list';
import { Permission, PermissionId } from '@core/iam/domain/entities/permission.entity';
import { Role, RoleId } from '@core/iam/domain/entities/role.entity';
import {
  Role as PrismaRole,
  Prisma,
  PermissionsOnRoles as PrismaPermissionsOnRoles,
  Permission as PrismaPermissions,
} from '@prisma/client';

interface Raw extends PrismaRole {
  permissionsOnRoles: Array<
    PrismaPermissionsOnRoles & {
      permission: PrismaPermissions;
    }
  >;
}

export class RolePrismaMapper {
  static toDomain(raw: Raw): Role {
    return new Role({
      id: new RoleId(raw.id),
      name: raw.name,
      permissions: new PermissionList(
        raw.permissionsOnRoles.map(
          (por) =>
            new Permission({
              id: new PermissionId(por.permissionId),
              value: por.permission.value,
              assignedById: por.assignedById,
            }),
        ),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(aggregate: Role): PrismaRole & Prisma.RoleUpdateInput {
    return {
      id: aggregate.id.value,
      name: aggregate.name,
      permissionsOnRoles: {
        deleteMany: aggregate.permissions.getRemovedItems().map((permission) => ({
          roleId: aggregate.id.value,
          permissionId: permission.id.value,
        })),
        createMany: {
          data: aggregate.permissions.getNewItems().map((permission) => ({
            value: permission.value,
            assignedById: permission.assignedById,
            permissionId: permission.id.value,
          })),
        },
        updateMany: aggregate.permissions.getNewItems().map((permission) => ({
          where: {
            roleId: aggregate.id.value,
            permissionId: permission.id.value,
          },
          data: {
            value: permission.value,
            assignedById: permission.assignedById,
            permissionId: permission.id.value,
          },
        })),
      },
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
