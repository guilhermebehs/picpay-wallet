import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from 'src/interfaces/in/http/balance.controller';
import { BalanceService } from 'src/services/balance.service';

describe('BalanceController', () => {
  let app: INestApplication;
  let balanceController: BalanceController;
  let balanceService: BalanceService;

  const data = {
    amount: 100,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        { provide: BalanceService, useValue: { invoke: () => data } },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    balanceController = app.get<BalanceController>(BalanceController);
    balanceService = app.get<BalanceService>(BalanceService);
  });

  describe('invoke()', () => {
    it('should retrieve balance successfully', async () => {
      const invokeSpy = jest.spyOn(balanceService, 'invoke');
      const promise = balanceController.invoke('12345');
      await expect(promise).resolves.toEqual(data);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, '12345');
    });
  });
});
