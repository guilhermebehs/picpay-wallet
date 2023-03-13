import { Module } from '@nestjs/common';
import { CashWithdrawController } from 'src/interfaces/in/http/cash-withdraw.controller';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  controllers: [CashWithdrawController],
  providers: [CashWithdrawService],
})
export class CashWithdrawModule {}
