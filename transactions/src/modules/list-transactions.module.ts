import { Module } from '@nestjs/common';
import { ListTransactionsController } from 'src/interfaces/in/http/list-transactions.controller';
import { ListTransactionsService } from 'src/services/list-transactions.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  providers: [ListTransactionsService],
  controllers: [ListTransactionsController],
  exports: [],
})
export class ListTransactionsModule {}
