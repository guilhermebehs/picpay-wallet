import {
  BadRequestException,
  INestApplication,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository, HistoryRepository } from 'src/contracts';
import { AccountDto, CashWithdrawDto } from 'src/dtos';
import { HistoryType } from 'src/enums/history-type.enum';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';
import { accountRepositoryMock, historyRepositoryMock } from 'test/mocks';

describe('CashWithdrawService', () => {
  let app: INestApplication;
  let accountRepository;
  let historyRepository;
  let cashWithdrawService: CashWithdrawService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CashWithdrawService,
        { provide: 'AccountRepository', useValue: accountRepositoryMock },
        { provide: 'HistoryRepository', useValue: historyRepositoryMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cashWithdrawService = app.get<CashWithdrawService>(CashWithdrawService);
    accountRepository = app.get<AccountRepository>('AccountRepository');
    historyRepository = app.get<HistoryRepository>('HistoryRepository');
  });

  describe('invoke()', () => {
    it('should withdraw cash successfully', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashWithdrawService.invoke(
        new CashWithdrawDto('some id', 2),
      );

      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(updateSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        amount: 8,
        name: 'some name',
        isEnabled: true,
        version: 1
      });
      expect(insertSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        oldAmount: 10,
        newAmount: 8,
        type: HistoryType.WITHDRAW,
      });
    });
    it('should throw when account does not exist', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(undefined);

      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashWithdrawService.invoke(
        new CashWithdrawDto('some id', 2),
      );

      await expect(promise).rejects.toEqual(
        new BadRequestException('Account does not exist'),
      );
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalledTimes(0);
      expect(insertSpy).toBeCalledTimes(0);
    });
    it('should throw when retrived account is not enabled', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(
          new AccountDto('some id', 'some name', 10, false),
        );

      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashWithdrawService.invoke(
        new CashWithdrawDto('some id', 2),
      );

      await expect(promise).rejects.toEqual(
        new UnprocessableEntityException('Account is not enabled'),
      );
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalledTimes(0);
      expect(insertSpy).toBeCalledTimes(0);
    });
    it('should throw when retrived account does not have enough money', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashWithdrawService.invoke(
        new CashWithdrawDto('some id', 20),
      );

      await expect(promise).rejects.toEqual(
        new UnprocessableEntityException('Account does not have enough money'),
      );
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalledTimes(0);
      expect(insertSpy).toBeCalledTimes(0);
    });
  });
});
