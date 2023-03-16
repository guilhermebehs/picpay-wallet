import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CancelTransactionDto } from 'src/dtos';
import { CancelTransactionController } from 'src/interfaces/in/http/cancel-transaction.controller';
import { CancelTransactionService } from 'src/services/cancel-transaction.service';
import { loggerMock } from 'test/mocks';

describe('CancelTransactionController', () => {
  let app: INestApplication;
  let logger;
  let cancelTransactionService: CancelTransactionService;
  let cancelTransactionController: CancelTransactionController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CancelTransactionController],
      providers: [
        {
          provide: CancelTransactionService,
          useValue: { invoke: jest.fn() },
        },
        { provide: 'Logger', useValue: loggerMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    cancelTransactionService = app.get<CancelTransactionService>(
      CancelTransactionService,
    );
    cancelTransactionController = app.get<CancelTransactionController>(
      CancelTransactionController,
    );
    logger = app.get('Logger');
  });
  describe('invoke()', () => {
    it('should cancel transacion successfully', async () => {
      const invokeSpy = jest.spyOn(cancelTransactionService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const payload = new CancelTransactionDto('some id', 1);

      const promise = cancelTransactionController.invoke(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/transactions/${payload.transactionId}/accounts/${payload.accountId}/cancel`,
        '{}',
      );
    });
  });
});
