import {
  BadRequestException,
  INestApplication,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository, HistoryRepository } from 'src/contracts';
import { AccountDto, CashDepositDto } from 'src/dtos';
import { CashDepositService } from 'src/services/cash-deposit.service';
import { accountRepositoryMock, historyRepositoryMock } from 'test/mocks';

describe('CashDepositService', () => {
  let app: INestApplication;
  let accountRepository;
  let historyRepository;
  let cashDepositService: CashDepositService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CashDepositService,
        { provide: 'AccountRepository', useValue: accountRepositoryMock },
        { provide: 'HistoryRepository', useValue: historyRepositoryMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cashDepositService = app.get<CashDepositService>(CashDepositService);
    accountRepository = app.get<AccountRepository>('AccountRepository');
    historyRepository = app.get<HistoryRepository>('HistoryRepository');
  });

  describe('invoke()', () => {
    it('should deposit cash successfully', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashDepositService.invoke(
        new CashDepositDto('some id', 5),
      );

      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(getByAccountSpy).toBeCalledWith('some id');
      expect(updateSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalledWith({
        id: 'some id',
        amount: 15,
        isEnabled: true,
      });
      expect(insertSpy).toBeCalledTimes(1);
      expect(insertSpy).toBeCalledWith({
        account: 'some id',
        oldAmount: 10,
        newAmount: 15,
      });
    });
    it('should throw when account does not exist', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(undefined);

      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashDepositService.invoke(
        new CashDepositDto('some id', 5),
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
        .mockResolvedValueOnce(new AccountDto('some id', 10, false));

      const updateSpy = jest.spyOn(accountRepository, 'update');
      const insertSpy = jest.spyOn(historyRepository, 'insert');

      const promise = cashDepositService.invoke(
        new CashDepositDto('some id', 5),
      );

      await expect(promise).rejects.toEqual(
        new UnprocessableEntityException('Account is not enabled'),
      );
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalledTimes(0);
      expect(insertSpy).toBeCalledTimes(0);
    });
  });
});
