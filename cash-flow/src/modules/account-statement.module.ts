import { CacheModule, Module } from '@nestjs/common';
import { AccountStatementController } from 'src/interfaces/in/http/account-statement.controller';
import { AccountStatementService } from 'src/services/account-statement.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [
    InfraModule,
    CacheModule.register({
      ttl: 5000,
      max: 20,
    }),
  ],
  controllers: [AccountStatementController],
  providers: [AccountStatementService],
})
export class AccountStatementModule {}
