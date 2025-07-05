import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateCustomerBodyDTO {
  @ApiProperty({
    description: "The customer's email address",
    example: 'email@example.com',
    required: true,
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: "The customer's name",
    example: 'Jhon Doe',
    required: true,
  })
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "The customer's password",
    required: true,
    minLength: 4,
    maxLength: 72,
  })
  @IsString()
  @Matches(/(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
  @Length(4, 72)
  public password!: string;
}
