import { Module } from '@nestjs/common';
import { AccountStatementModule } from './account-statement.module';
import { CashDepositModule } from './cash-deposit.module';
import { CashWithdrawModule } from './cash-withdraw.module';
import { CreateAccountModule } from './create-account.module';
import { InfraModule } from './infra.module';
import { MessagingModule } from './messaging.module';

@Module({
  imports: [
    CreateAccountModule,
    CashDepositModule,
    CashWithdrawModule,
    InfraModule,
    AccountStatementModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
