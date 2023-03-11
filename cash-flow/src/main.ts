import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CashDepositService } from './services/cash-deposit.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const a = app.get(CashDepositService);
  await a.invoke({ accountId: '123', amount: 10 });
  await app.listen(3000);
}
bootstrap();
