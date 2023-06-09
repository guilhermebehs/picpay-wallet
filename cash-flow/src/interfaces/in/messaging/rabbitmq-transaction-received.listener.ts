import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository, HistoryRepository, Logger } from 'src/contracts';
import { HistoryDto } from 'src/dtos';
import { TransactionReceivedDto } from 'src/dtos/transaction-received.dto';
import { HistoryType } from 'src/enums/history-type.enum';

@Injectable()
export class RabbitMqTransactionReceivedListener {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('HistoryRepository')
    private readonly historyRepository: HistoryRepository,
    @Inject('Logger')
    private readonly logger: Logger,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'transaction-received',
    queue: 'transaction-received',
    routingKey: '',
  })
  public async listen(transactionReceived: TransactionReceivedDto) {
    try {
      this.logger.print(
        `event "transaction-received"`,
        JSON.stringify(transactionReceived),
      );
      this.validateFields(transactionReceived);

      const account = await this.accountRepository.getByAccount(
        transactionReceived.account,
      );

      if (!account) throw new Error('Account does not exist');

      const oldAmount = account.amount;

      if (transactionReceived.type === HistoryType.PURCHASE)
        account.amount -= transactionReceived.amount;
      else if (transactionReceived.type === HistoryType.CANCELLATION)
        account.amount += transactionReceived.amount;

      await this.accountRepository.update(account);
      await this.historyRepository.insert(
        new HistoryDto(
          account.id,
          oldAmount,
          account.amount,
          transactionReceived.type,
        ),
      );
    } catch (e) {
      const message = e.message;
      const error = {
        message,
        payload: transactionReceived,
        date: new Date(),
      };
      this.logger.error(`event "transaction-received"`, message);
      await this.amqpConnection.publish('transaction-received-dl', '', error);
    }
  }

  private validateFields(transactionReceived: TransactionReceivedDto) {
    const mandatoryProperties = ['account', 'amount', 'type', 'ocurredOn'];
    mandatoryProperties.forEach((property) => {
      if (!transactionReceived[property])
        throw new Error(`Missing property '${property}'`);
    });
  }
}
