import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CashWithdrawDto } from 'src/dtos';
import { CashWithdrawController } from 'src/interfaces/in/http/cash-withdraw.controller';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';

describe('CashWithdrawController', () => {
  let app: INestApplication;
  let cashWithdrawController: CashWithdrawController;
  let cashWithdrawService: CashWithdrawService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CashWithdrawController],
      providers: [
        { provide: CashWithdrawService, useValue: { invoke: jest.fn() } },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cashWithdrawController = app.get<CashWithdrawController>(
      CashWithdrawController,
    );
    cashWithdrawService = app.get<CashWithdrawService>(CashWithdrawService);
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(cashWithdrawService, 'invoke');
      const payload = new CashWithdrawDto('12345', 10);
      const promise = cashWithdrawController.invoke(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
    });
  });
});
