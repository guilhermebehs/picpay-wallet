import { Module } from '@nestjs/common';
import { CashDepositModule } from './cash-deposit.module';
import { CashWithdrawModule } from './cash-withdraw.module';
import { CreateAccountModule } from './create-account.module';
import { InfraModule } from './infra.module';

@Module({
  imports: [
    CreateAccountModule,
    CashDepositModule,
    CashWithdrawModule,
    InfraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
