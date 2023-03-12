import { Body, Controller, Post } from '@nestjs/common';
import { CashDepositDto } from 'src/dtos';
import { CashDepositService } from 'src/services/cash-deposit.service';

@Controller('v1/cash-flow/deposit')
export class CashDepositController {
  constructor(private readonly cashDepositService: CashDepositService) {}

  @Post()
  public async invoke(@Body() cashDepositDto: CashDepositDto) {
    await this.cashDepositService.invoke(cashDepositDto);
  }
}
