import { Module } from '@nestjs/common';
import { CancelTransactionController } from 'src/interfaces/in/http/cancel-transaction.controller';
import { CancelTransactionService } from 'src/services/cancel-transaction.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  providers: [CancelTransactionService],
  controllers: [CancelTransactionController],
  exports: [],
})
export class CancelTransactionModule {}
