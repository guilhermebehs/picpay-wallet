import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from 'src/services/balance.service';

@Controller('v1/cash-flow/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':account')
  public async invoke(@Param('account') account) {
    return await this.balanceService.invoke(account);
  }
}
