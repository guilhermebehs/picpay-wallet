import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from 'src/interfaces/in/http/balance.controller';
import { BalanceService } from 'src/services/balance.service';
import { loggerMock } from 'test/mocks';

describe('BalanceController', () => {
  let app: INestApplication;
  let balanceController: BalanceController;
  let balanceService: BalanceService;
  let logger;

  const data = {
    amount: 100,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        { provide: BalanceService, useValue: { invoke: () => data } },
        {
          provide: 'Logger',
          useValue: loggerMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    balanceController = app.get<BalanceController>(BalanceController);
    balanceService = app.get<BalanceService>(BalanceService);
    logger = app.get('Logger');
  });

  describe('invoke()', () => {
    it('should retrieve balance successfully', async () => {
      const invokeSpy = jest.spyOn(balanceService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const promise = balanceController.invoke('12345');
      await expect(promise).resolves.toEqual(data);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, '12345');
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/cash-flow/balance/12345`,
        '{}',
      );
    });
  });
});
