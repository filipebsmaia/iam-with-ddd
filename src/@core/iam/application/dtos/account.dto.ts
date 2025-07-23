import crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@core/iam/domain/entities/account.entity';

export class AccountDTO {
  @ApiProperty({
    description: 'Permission identifier',
    example: crypto.randomUUID(),
    required: true,
  })
  public id!: string;

  @ApiProperty({
    description: 'Permission value',
    example: AccountType.STAFF,
    required: true,
    type: () => AccountType,
  })
  public type!: AccountType;

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
