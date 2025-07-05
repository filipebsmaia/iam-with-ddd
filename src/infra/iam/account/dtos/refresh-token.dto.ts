import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginAccountBodyDTO {
  @ApiProperty({
    description: "The customer's email address",
    example: 'email@example.com',
    required: true,
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: "The account's password",
    required: true,
  })
  @IsString()
  public password!: string;
}
