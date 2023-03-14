import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { RabbitMqTransactionNotifier } from 'src/interfaces/out/messaging/rabbitmq-transaction.notifier';

config();

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'transaction-received',
          type: 'fanout',
        },
      ],
      uri: process.env.RABBIT_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [
    { provide: 'TransactionNotifier', useClass: RabbitMqTransactionNotifier },
  ],
  exports: [
    { provide: 'TransactionNotifier', useClass: RabbitMqTransactionNotifier },
  ],
})
export class MessagingModule {}
