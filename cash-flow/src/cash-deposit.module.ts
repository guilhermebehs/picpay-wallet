import { Module } from '@nestjs/common';
import { InfraModule } from './infra.module';
import { CashDepositController } from './interfaces/in/http/cash-deposit.controller';
import { CashDepositService } from './services/cash-deposit.service';

@Module({
  imports: [InfraModule],
  controllers: [CashDepositController],
  providers: [CashDepositService],
})
export class CashDepositModule {}
