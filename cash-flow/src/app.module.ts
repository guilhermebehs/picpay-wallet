import { Module } from '@nestjs/common';
import { CreateAccountModule } from './create-account.module';
import { InfraModule } from './infra.module';

@Module({
  imports: [CreateAccountModule, InfraModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
