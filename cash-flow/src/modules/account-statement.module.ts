import { Module } from '@nestjs/common';
import { AccountStatementController } from 'src/interfaces/in/http/account-statement.controller';
import { AccountStatementService } from 'src/services/account-statement.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  controllers: [AccountStatementController],
  providers: [AccountStatementService],
})
export class AccountStatementModule {}
