import crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionOnRoleDTO {
  @ApiProperty({
    description: 'Permission identifier',
    example: crypto.randomUUID(),
    required: true,
  })
  public id!: string;

  @ApiProperty({
    description: 'Permission assigner account identifier',
    example: crypto.randomUUID(),
    required: true,
  })
  public assignedById!: string;

  @ApiProperty({
    description: 'Permission value',
    example: crypto.randomUUID(),
    required: true,
  })
  public value!: string;
}

export class RoleDTO {
  @ApiProperty({
    description: 'Role identifier',
    example: crypto.randomUUID(),
    required: true,
  })
  public id!: string;

  @ApiProperty({
    description: 'Role name',
    example: crypto.randomUUID(),
    required: true,
  })
  public name!: string;

  @ApiProperty({
    description: 'Role name',
    example: [
      {
        id: crypto.randomUUID(),
        assignedById: crypto.randomUUID(),
        value: 'account.get',
      },
    ],
    required: true,
    isArray: true,
    type: PermissionOnRoleDTO,
  })
  public permissions!: Array<PermissionOnRoleDTO>;

  @ApiProperty({
    example: new Date(),
    required: true,
  })
  public createdAt!: Date;

  @ApiProperty({
    example: new Date(),
    required: true,
  })
  public updatedAt!: Date;
}
