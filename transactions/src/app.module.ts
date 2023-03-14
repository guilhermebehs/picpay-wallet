import { Module } from '@nestjs/common';
import { CreateTransactionModule } from './modules/create-transaction.module';
import { InfraModule } from './modules/infra.module';

@Module({
  imports: [InfraModule, CreateTransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
