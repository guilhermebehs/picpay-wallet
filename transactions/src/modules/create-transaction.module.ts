import { Module } from '@nestjs/common';
import { CreateTransactionController } from 'src/interfaces/in/http/create-transaction.controller';
import { CreateTransactionService } from 'src/services/create-transaction.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  providers: [CreateTransactionService],
  controllers: [CreateTransactionController],
  exports: [],
})
export class CreateTransactionModule {}
