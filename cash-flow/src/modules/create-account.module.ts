import { Module } from '@nestjs/common';
import { CreateAccountController } from 'src/interfaces/in/http/create-account.controller';
import { CreateAccountService } from 'src/services/create-account.service';
import { InfraModule } from './infra.module';

@Module({
  imports: [InfraModule],
  controllers: [CreateAccountController],
  providers: [CreateAccountService],
})
export class CreateAccountModule {}
