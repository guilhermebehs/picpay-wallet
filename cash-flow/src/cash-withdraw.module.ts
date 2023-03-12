import { Module } from '@nestjs/common';
import { InfraModule } from './infra.module';
import { CashWithdrawController } from './interfaces/in/http/cash-withdraw.controller';
import { CashWithdrawService } from './services/cash-withdraw.service';

@Module({
  imports: [InfraModule],
  controllers: [CashWithdrawController],
  providers: [CashWithdrawService],
})
export class CashWithdrawModule {}
