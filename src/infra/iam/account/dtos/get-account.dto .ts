import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetAccountParamsDTO {
  @ApiProperty({
    description: 'The account id',
    example: crypto.randomUUID(),
    required: true,
  })
  @IsUUID()
  public accountId!: string;
}
