import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CashWithdrawDto } from 'src/dtos';
import { CashWithdrawController } from 'src/interfaces/in/http/cash-withdraw.controller';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';
import { loggerMock } from 'test/mocks';

describe('CashWithdrawController', () => {
  let app: INestApplication;
  let cashWithdrawController: CashWithdrawController;
  let cashWithdrawService: CashWithdrawService;
  let logger;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CashWithdrawController],
      providers: [
        { provide: CashWithdrawService, useValue: { invoke: jest.fn() } },
        {
          provide: 'Logger',
          useValue: loggerMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cashWithdrawController = app.get<CashWithdrawController>(
      CashWithdrawController,
    );
    cashWithdrawService = app.get<CashWithdrawService>(CashWithdrawService);
    logger = app.get('Logger');
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(cashWithdrawService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const payload = new CashWithdrawDto('12345', 10);
      const promise = cashWithdrawController.invoke(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/cash-flow/withdraw`,
        JSON.stringify(payload),
      );
    });
  });
});
