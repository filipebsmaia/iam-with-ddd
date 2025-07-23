import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerBodyDTO } from './dtos/create-customer.dto';
import { CreateCustomerCommand } from '@core/account/application/command/create-customer.command';

@UsePipes(new ValidationPipe())
@ApiTags('customers')
@Controller('v1/customers')
export class CustomerController {
  constructor(private readonly createCustomerCommand: CreateCustomerCommand) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @Post('/')
  async create(@Body() { name, email, password }: CreateCustomerBodyDTO) {
    await this.createCustomerCommand.execute({
      name,
      email,
      password,
    });
  }
}
