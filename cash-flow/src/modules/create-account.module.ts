import { Module } from '@nestjs/common';
import { InfraModule } from './infra.module';
import { CreateAccountController } from './interfaces/in/http/create-account.controller';
import { CreateAccountService } from './services/create-account.service';

@Module({
  imports: [InfraModule],
  controllers: [CreateAccountController],
  providers: [CreateAccountService],
})
export class CreateAccountModule {}
