import {
  BadRequestException,
  INestApplication,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository, HistoryRepository } from 'src/contracts';
import { AccountDto, CashDepositDto } from 'src/dtos';
import { HistoryType } from 'src/enums/history-type.enum';
import { CashDepositService } from 'src/services/cash-deposit.service';
import { accountRepositoryMock, historyRepositoryMock } from 'test/mocks';

describe('CashDepositService', () => {
  let app: INestApplication;
  let accountRepository;
  let historyRepository;
  let cashDepositService: CashDepositService;

  beforeAll(async () => {
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
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(updateSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        name: 'some name',
        amount: 15,
        isEnabled: true,
      });
      expect(insertSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        oldAmount: 10,
        newAmount: 15,
        type: HistoryType.DEPOSIT,
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
        .mockResolvedValueOnce(
          new AccountDto('some id', 'some name', 10, false),
        );

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
