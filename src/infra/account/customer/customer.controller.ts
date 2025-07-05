import { CreateCustomerUseCase } from '@core/account/application/use-cases/create-customer.use-case';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerBodyDTO } from './dtos/create-customer.dto';
import { CustomerPresenter } from './presenters/customer.presenter';

@UsePipes(new ValidationPipe())
@ApiTags('customers')
@Controller('v1/customers')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @Post('/')
  async create(@Body() { name, email, password }: CreateCustomerBodyDTO) {
    const customer = await this.createCustomerUseCase.execute({
      name,
      email,
      password,
    });

    return CustomerPresenter.present(customer);
  }
}
