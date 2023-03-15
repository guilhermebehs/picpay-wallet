import { Module } from '@nestjs/common';
import { CancelTransactionModule } from './cancel-transaction.module';
import { CreateTransactionModule } from './create-transaction.module';
import { InfraModule } from './infra.module';
import { ListTransactionsModule } from './list-transactions.module';

@Module({
  imports: [
    InfraModule,
    CreateTransactionModule,
    CancelTransactionModule,
    ListTransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
