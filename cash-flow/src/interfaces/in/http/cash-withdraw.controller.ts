import { Body, Controller, Post } from '@nestjs/common';
import { CashWithdrawDto } from 'src/dtos';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';

@Controller('v1/cash-flow/withdraw')
export class CashWithdrawController {
  constructor(private readonly cashWithdrawService: CashWithdrawService) {}

  @Post()
  public async invoke(@Body() cashWithdrawDto: CashWithdrawDto) {
    await this.cashWithdrawService.invoke(cashWithdrawDto);
  }
}
