import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CashDepositDto } from 'src/dtos';
import { CashDepositController } from 'src/interfaces/in/http/cash-deposit.controller';
import { CashDepositService } from 'src/services/cash-deposit.service';
import { loggerMock } from 'test/mocks';

describe('CashDepositController', () => {
  let app: INestApplication;
  let cashDepositController: CashDepositController;
  let cashDepositService: CashDepositService;
  let logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CashDepositController],
      providers: [
        { provide: CashDepositService, useValue: { invoke: jest.fn() } },
        {
          provide: 'Logger',
          useValue: loggerMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cashDepositController = app.get<CashDepositController>(
      CashDepositController,
    );
    cashDepositService = app.get<CashDepositService>(CashDepositService);
    logger = app.get('Logger');
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(cashDepositService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const payload = new CashDepositDto('12345', 10);
      const promise = cashDepositController.invoke(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/cash-flow/deposit`,
        JSON.stringify(payload),
      );
    });
  });
});
