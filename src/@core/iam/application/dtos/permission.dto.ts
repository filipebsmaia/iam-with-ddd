import crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDTO {
  @ApiProperty({
    description: 'Permission identifier',
    example: crypto.randomUUID(),
    required: true,
  })
  public id!: string;

  @ApiProperty({
    description: 'Permission value',
    example: crypto.randomUUID(),
    required: true,
  })
  public value!: string;

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
