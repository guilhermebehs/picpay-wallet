import { Module } from '@nestjs/common';
import { CancelTransactionModule } from './cancel-transaction.module';
import { CreateTransactionModule } from './create-transaction.module';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule, CreateTransactionModule, CancelTransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
