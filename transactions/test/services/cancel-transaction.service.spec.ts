import {
  ForbiddenException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CancelTransactionDto, TransactionDto } from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { CancelTransactionService } from 'src/services/cancel-transaction.service';
import { transactionNotifierMock, transactionRepositoryMock } from 'test/mocks';

describe('CancelTransactionService', () => {
  let app: INestApplication;
  let transactionNotifier;
  let transactionRepository;
  let cancelTransactionService: CancelTransactionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CancelTransactionService,
        { provide: 'TransactionNotifier', useValue: transactionNotifierMock },
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    jest.useFakeTimers().setSystemTime(new Date());
    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    cancelTransactionService = app.get<CancelTransactionService>(
      CancelTransactionService,
    );
    transactionNotifier = app.get('TransactionNotifier');
    transactionRepository = app.get('TransactionRepository');
  });

  describe('invoke()', () => {
    it('should cancel transaction successfully', async () => {
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const getByIdSpy = jest.spyOn(transactionRepository, 'getById');
      const updateSpy = jest.spyOn(transactionRepository, 'update');

      const payload = new CancelTransactionDto('some id', 1);

      const promise = cancelTransactionService.invoke(payload);

      await expect(promise).resolves.toBeUndefined();
      expect(getByIdSpy).toHaveBeenNthCalledWith(1, 1);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        ocurredOn: new Date(),
        amount: 10,
        type: TransactionType.CANCELLATION,
      });
      expect(updateSpy).toHaveBeenNthCalledWith(
        1,
        new TransactionDto(
          1,
          'some id',
          10,
          TransactionStatus.CANCELED,
          new Date(),
        ),
      );
    });
    it('should throw when transaction does not exist', async () => {
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const getByIdSpy = jest
        .spyOn(transactionRepository, 'getById')
        .mockResolvedValueOnce(null);
      const updateSpy = jest.spyOn(transactionRepository, 'update');

      const payload = new CancelTransactionDto('some id', 1);

      const promise = cancelTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new NotFoundException('Transaction does not exist'),
      );
      expect(getByIdSpy).toHaveBeenNthCalledWith(1, 1);
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
    });
    it('should throw when transaction does not belong to account', async () => {
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const getByIdSpy = jest.spyOn(transactionRepository, 'getById');
      const updateSpy = jest.spyOn(transactionRepository, 'update');

      const payload = new CancelTransactionDto('some id 2', 1);

      const promise = cancelTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new ForbiddenException(
          'This account is not allowed to cancel this transaction',
        ),
      );
      expect(getByIdSpy).toHaveBeenNthCalledWith(1, 1);
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
    });
    it('should throw when transaction does not belong to account', async () => {
      const invokeSpy = jest.spyOn(transactionNotifier, 'invoke');
      const getByIdSpy = jest
        .spyOn(transactionRepository, 'getById')
        .mockResolvedValueOnce(
          new TransactionDto(
            1,
            'some id',
            10,
            TransactionStatus.CANCELED,
            new Date(),
          ),
        );
      const updateSpy = jest.spyOn(transactionRepository, 'update');

      const payload = new CancelTransactionDto('some id', 1);

      const promise = cancelTransactionService.invoke(payload);

      await expect(promise).rejects.toEqual(
        new ForbiddenException(
          `Transaction with status '${TransactionStatus.CANCELED}' can not be canceled`,
        ),
      );
      expect(getByIdSpy).toHaveBeenNthCalledWith(1, 1);
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
    });
  });
});
