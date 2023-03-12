import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from 'src/dtos';
import { CreateAccountService } from 'src/services/create-account.service';

@Controller('v1/cash-flow/create-account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  public async invoke(@Body() createAccountDto: CreateAccountDto) {
    await this.createAccountService.invoke(createAccountDto);
  }
}
