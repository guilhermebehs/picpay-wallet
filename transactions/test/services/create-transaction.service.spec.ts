import {
  BadRequestException,
  INestApplication,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateTransactionDto } from 'src/dtos';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { CreateTransactionService } from 'src/services/create-transaction.service';
import {
  accountServiceMock,
  transactionNotifierMock,
  transactionRepositoryMock,
} from 'test/mocks';

describe('CreateTransactionService', () => {
  let app: INestApplication;
  let accountService;
  let transactionNotifier;
  let transactionRepository;
  let createTransactionService: CreateTransactionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionService,
        { provide: 'TransactionNotifier', useValue: transactionNotifierMock },
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
        { provide: 'AccountService', useValue: accountServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    createTransactionService = app.get<CreateTransactionService>(
      CreateTransactionService,
    );
    transactionNotifier = app.get('TransactionNotifier');
    transactionRepository = app.get('TransactionRepository');
    accountService = app.get('AccountService');
  });

  describe('invoke()', () => {
    it('should create transaction successfully', async () => {
      const getByAccountIdSpy = jest.spyOn(accountService, 'getByAccountId');
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const createSpy = jest.spyOn(transactionRepository, 'create');

      const payload = new CreateTransactionDto(10, 'some id');

      const promise = createTransactionService.invoke(payload);

      await expect(promise).resolves.toEqual({ transactionId: 1 });
      expect(getByAccountIdSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(invokeSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        ocurredOn: new Date(),
        amount: 10,
        type: TransactionType.PURCHASE,
      });
      expect(createSpy).toHaveBeenNthCalledWith(1, payload);
    });

    it('should throw when account does not exist', async () => {
      const getByAccountIdSpy = jest
        .spyOn(accountService, 'getByAccountId')
        .mockResolvedValueOnce(null);
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const createSpy = jest.spyOn(transactionRepository, 'create');

      const payload = new CreateTransactionDto(10, 'some id');

      const promise = createTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new BadRequestException('Account does not exist'),
      );
      expect(getByAccountIdSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(createSpy).toHaveBeenCalledTimes(0);
    });
    it('should throw when account is not enabled', async () => {
      const getByAccountIdSpy = jest
        .spyOn(accountService, 'getByAccountId')
        .mockResolvedValueOnce({ isEnabled: false });
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const createSpy = jest.spyOn(transactionRepository, 'create');

      const payload = new CreateTransactionDto(10, 'some id');

      const promise = createTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new UnprocessableEntityException('Account is not enabled'),
      );
      expect(getByAccountIdSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(createSpy).toHaveBeenCalledTimes(0);
    });

    it('should throw when account does not have enough money', async () => {
      const getByAccountIdSpy = jest
        .spyOn(accountService, 'getByAccountId')
        .mockResolvedValueOnce({ isEnabled: true, amount: 0 });
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const createSpy = jest.spyOn(transactionRepository, 'create');

      const payload = new CreateTransactionDto(10, 'some id');

      const promise = createTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new UnprocessableEntityException('Account does not have enough money'),
      );
      expect(getByAccountIdSpy).toHaveBeenNthCalledWith(1, 'some id');
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(createSpy).toHaveBeenCalledTimes(0);
    });
  });
});
