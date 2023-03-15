import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto, TransactionDto } from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionEntity } from 'src/infra/db/entities/transaction.entity';
import { SqlTransactionRepository } from 'src/infra/db/repositories/sql-transaction-repository';

describe('SqlTransactionRepository', () => {
  let app: INestApplication;
  let sqlTransactionRepository: SqlTransactionRepository;
  let repository;
  const transaction: TransactionEntity = {
    id: 1,
    account: 'some id',
    amount: 10,
    status: TransactionStatus.APPROVED,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SqlTransactionRepository,
        {
          provide: 'TransactionEntityRepository',
          useValue: {
            save: () => transaction,
            findOneBy: () => transaction,
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    jest.useFakeTimers().setSystemTime(new Date());

    app = moduleFixture.createNestApplication();
    await app.init();

    sqlTransactionRepository = app.get<SqlTransactionRepository>(
      SqlTransactionRepository,
    );
    repository = app.get('TransactionEntityRepository');
  });

  describe('create()', () => {
    it('should create successfully', async () => {
      const saveSpy = jest.spyOn(repository, 'save');
      const promise = sqlTransactionRepository.create(
        new CreateTransactionDto(10, 'some id'),
      );
      await expect(promise).resolves.toEqual(1);
      expect(saveSpy).toHaveBeenNthCalledWith(1, {
        account: 'some id',
        accountId: 'some id',
        amount: 10,
        status: TransactionStatus.APPROVED,
      });
    });
  });
  describe('update()', () => {
    it('should update successfully', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      const promise = sqlTransactionRepository.update(
        new TransactionDto(
          1,
          'some id',
          10,
          TransactionStatus.CANCELED,
          new Date(),
        ),
      );
      await expect(promise).resolves.toBeUndefined();
      expect(saveSpy).toHaveBeenNthCalledWith(1, {
        id: 1,
        account: 'some id',
        amount: 10,
        status: TransactionStatus.CANCELED,
        date: new Date()
      });
    });
  });
  describe('getById()', () => {
    it('should return transaction successfully', async () => {
      const findOneBySpy = jest.spyOn(repository, 'findOneBy');
      const promise = sqlTransactionRepository.getById(1);
      await expect(promise).resolves.toEqual(transaction);
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 1 });
    });
    it('should return null when repository returns null', async () => {
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null);
      const promise = sqlTransactionRepository.getById(1);
      await expect(promise).resolves.toEqual(null);
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 1 });
    });
  });
});
