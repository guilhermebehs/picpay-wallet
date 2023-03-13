import { Module } from '@nestjs/common';
import { BalanceController } from 'src/interfaces/in/http/balance.controller';
import { BalanceService } from 'src/services/balance.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
