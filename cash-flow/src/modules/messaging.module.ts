import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { RabbitMqTransactionReceivedListener } from 'src/interfaces/in/messaging/rabbitmq-transaction-received.listener';
import { InfraModule } from './infra.module';

config();

@Module({
  imports: [
    InfraModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'transaction-received',
          type: 'fanout',
        },
        {
          name: 'transaction-received-dl',
          type: 'fanout',
        },
      ],
      uri: process.env.RABBIT_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [RabbitMqTransactionReceivedListener],
})
export class MessagingModule {}
