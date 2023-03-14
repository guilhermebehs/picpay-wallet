import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TransactionNotifier } from 'src/contracts';
import { TransactionReceivedDto } from 'src/dtos';

@Injectable()
export class RabbitMqTransactionNotifier implements TransactionNotifier {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async invoke(transactionReceivedDto: TransactionReceivedDto): Promise<void> {
    await this.amqpConnection.publish(
      'transaction-received',
      '',
      transactionReceivedDto,
    );
  }
}
