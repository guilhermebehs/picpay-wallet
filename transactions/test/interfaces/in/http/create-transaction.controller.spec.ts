import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateTransactionDto } from 'src/dtos';
import { CreateTransactionController } from 'src/interfaces/in/http/create-transaction.controller';
import { CreateTransactionService } from 'src/services/create-transaction.service';
import { loggerMock } from 'test/mocks';

describe('CreateTransactionController', () => {
  let app: INestApplication;
  let logger;
  let createTransactionService: CreateTransactionService;
  let createTransactionController: CreateTransactionController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CreateTransactionController],
      providers: [
        {
          provide: CreateTransactionService,
          useValue: { invoke: () => ({ transactionId: 1 }) },
        },
        { provide: 'Logger', useValue: loggerMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    createTransactionService = app.get<CreateTransactionService>(
      CreateTransactionService,
    );
    createTransactionController = app.get<CreateTransactionController>(
      CreateTransactionController,
    );
    logger = app.get('Logger');
  });
  describe('invoke()', () => {
    it('should create transacion successfully', async () => {
      const invokeSpy = jest.spyOn(createTransactionService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const payload = new CreateTransactionDto(10, 'some id');

      const promise = createTransactionController.invoke(payload);
      await expect(promise).resolves.toEqual({ transactionId: 1 });
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/transactions`,
        JSON.stringify(payload),
      );
    });
  });
});
