import { Account, AccountId } from '@core/iam/domain/entities/account.entity';
import {
  AccountType,
  Account as PrismaAccount,
  Role as PrismaRole,
  Credential as PrismaCredential,
  Prisma,
} from '@prisma/client';
import { Credential, CredentialId } from '@core/iam/domain/entities/credential.entity';
import HashedPassword from '@core/iam/domain/entities/value-objects/hashed-password.value-objet';
import { RoleIdList } from '@core/iam/domain/entities/role-id-list';
import { RoleId } from '@core/iam/domain/entities/role.entity';

export interface RawAccount extends PrismaAccount {
  credential?: PrismaCredential | null;
  roles: Array<PrismaRole>;
  // roles: Array<
  //   PrismaRole & {
  //     permissionsOnRoles: Array<
  //       PrismaPermissionsOnRoles & {
  //         permission: PrismaPermissions;
  //       }
  //     >;
  //   }
  // >;
}

export class AccountPrismaMapper {
  static toDomain(raw: RawAccount): Account {
    return new Account({
      id: new AccountId(raw.id),
      type: raw.type as AccountType,
      roles: new RoleIdList(raw.roles.map((role) => new RoleId(role.id))),
      credential: raw.credential
        ? new Credential({
            id: new CredentialId(raw.credential.id),
            hashedPassword: new HashedPassword(raw.credential.hashedPassword),
          })
        : undefined,
    });
  }

  static toUpdatePersistence(aggregate: Account): Prisma.AccountUpdateInput {
    return {
      id: aggregate.id.value,
      type: aggregate.type,
      roles: {
        disconnect: aggregate.roles.getRemovedItems().map((roleId) => ({
          id: roleId.value,
        })),
        connect: aggregate.roles.getNewItems().map((roleId) => ({
          id: roleId.value,
        })),
      },
      credential: aggregate.credential
        ? {
            upsert: {
              create: {
                id: aggregate.credential.id.value,
                hashedPassword: aggregate.credential.hashedPassword.value,
              },
              update: {
                hashedPassword: aggregate.credential.hashedPassword.value,
              },
            },
          }
        : undefined,
    };
  }
}
