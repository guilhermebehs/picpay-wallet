import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReceivedDto } from 'src/dtos/transaction-received.dto';
import { HistoryType } from 'src/enums/history-type.enum';
import { RabbitMqTransactionReceivedListener } from 'src/interfaces/in/messaging/rabbitmq-transaction-received.listener';
import {
  accountRepositoryMock,
  historyRepositoryMock,
  loggerMock,
} from 'test/mocks';

describe('RabbitMqTransactionReceivedListener', () => {
  let app: INestApplication;
  let rabbitMqTransactionReceivedListener: RabbitMqTransactionReceivedListener;
  let accountRepository;
  let historyRepository;
  let amqpConnection;
  let logger;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMqTransactionReceivedListener,
        { provide: 'AccountRepository', useValue: accountRepositoryMock },
        { provide: 'HistoryRepository', useValue: historyRepositoryMock },
        { provide: AmqpConnection, useValue: { publish: jest.fn() } },
        {
          provide: 'Logger',
          useValue: loggerMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    rabbitMqTransactionReceivedListener =
      app.get<RabbitMqTransactionReceivedListener>(
        RabbitMqTransactionReceivedListener,
      );
    accountRepository = app.get('AccountRepository');
    historyRepository = app.get('HistoryRepository');
    amqpConnection = app.get(AmqpConnection);
    logger = app.get('Logger');
  });
  describe('listen()', () => {
    it('should handle transaction with type "purchase" successfully', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const printSpy = jest.spyOn(logger, 'print');
      const errorSpy = jest.spyOn(logger, 'error');
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');
      const publishSpy = jest.spyOn(amqpConnection, 'publish');

      const payload: TransactionReceivedDto = {
        account: 'some id',
        amount: 2,
        type: HistoryType.PURCHASE,
        ocurredOn: new Date(),
      };
      const promise = rabbitMqTransactionReceivedListener.listen(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, payload.account);
      expect(insertSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        oldAmount: 10,
        newAmount: 8,
        type: HistoryType.PURCHASE,
      });
      expect(updateSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        name: 'some name',
        amount: 8,
        isEnabled: true,
      });
      expect(publishSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `event "transaction-received"`,
        JSON.stringify(payload),
      );
    });
    it('should handle transaction with type "cancellation" successfully', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const printSpy = jest.spyOn(logger, 'print');
      const errorSpy = jest.spyOn(logger, 'error');
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');
      const publishSpy = jest.spyOn(amqpConnection, 'publish');

      const payload: TransactionReceivedDto = {
        account: 'some id',
        amount: 2,
        type: HistoryType.CANCELLATION,
        ocurredOn: new Date(),
      };
      const promise = rabbitMqTransactionReceivedListener.listen(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, payload.account);
      expect(insertSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        oldAmount: 10,
        newAmount: 12,
        type: HistoryType.CANCELLATION,
      });
      expect(updateSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        name: 'some name',
        amount: 12,
        isEnabled: true,
      });
      expect(publishSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `event "transaction-received"`,
        JSON.stringify(payload),
      );
    });



    it('should throw when account does not exist', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(null);
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const printSpy = jest.spyOn(logger, 'print');
      const errorSpy = jest.spyOn(logger, 'error');
      const insertSpy = jest.spyOn(historyRepository, 'insert');
      const publishSpy = jest.spyOn(amqpConnection, 'publish');

      const payload: TransactionReceivedDto = {
        account: '12345',
        amount: 2,
        type: HistoryType.CANCELLATION,
        ocurredOn: new Date(),
      };

      const error = {
        message: 'Account does not exist',
        payload: payload,
        date: new Date(),
      };

      const promise = rabbitMqTransactionReceivedListener.listen(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, payload.account);
      expect(insertSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(publishSpy).toHaveBeenNthCalledWith(
        1,
        'transaction-received-dl',
        '',
        error,
      );
      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        `event "transaction-received"`,
        error.message,
      );
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `event "transaction-received"`,
        JSON.stringify(payload),
      );
    });

    const mandatoryProperties = ['account', 'amount', 'type', 'ocurredOn'];

    for (const property of mandatoryProperties) {
      it(`should throw when payload has no ${property}`, async () => {
        const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
        const printSpy = jest.spyOn(logger, 'print');
        const errorSpy = jest.spyOn(logger, 'error');
        const updateSpy = jest.spyOn(accountRepository, 'update');
        const insertSpy = jest.spyOn(historyRepository, 'insert');
        const publishSpy = jest.spyOn(amqpConnection, 'publish');

        const payload: TransactionReceivedDto = {
          account: '12345',
          amount: 2,
          type: HistoryType.CANCELLATION,
          ocurredOn: new Date(),
        };

        payload[property] = undefined;

        const error = {
          message: `Missing property '${property}'`,
          payload: payload,
          date: new Date(),
        };

        const promise = rabbitMqTransactionReceivedListener.listen(payload);
        await expect(promise).resolves.toBeUndefined();
        expect(getByAccountSpy).toHaveBeenCalledTimes(0);
        expect(insertSpy).toHaveBeenCalledTimes(0);
        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(publishSpy).toHaveBeenNthCalledWith(
          1,
          'transaction-received-dl',
          '',
          error,
        );
        expect(errorSpy).toHaveBeenNthCalledWith(
          1,
          `event "transaction-received"`,
          error.message,
        );
        expect(printSpy).toHaveBeenNthCalledWith(
          1,
          `event "transaction-received"`,
          JSON.stringify(payload),
        );
      });
    }
  });
});
