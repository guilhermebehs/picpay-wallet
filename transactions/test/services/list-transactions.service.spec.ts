import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { ListTransactionsParamsDto, TransactionDto } from 'src/dtos';
import { SortType } from 'src/enums/sort-type.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { ListTransactionsService } from 'src/services/list-transactions.service';
import { transactionRepositoryMock } from 'test/mocks';

describe('ListTransactionsService', () => {
  let app: INestApplication;
  let transactionRepository;
  let listTransactionsService: ListTransactionsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListTransactionsService,
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    listTransactionsService = app.get<ListTransactionsService>(
      ListTransactionsService,
    );
    transactionRepository = app.get('TransactionRepository');
  });

  describe('invoke()', () => {
    it('should return transactions successfully', async () => {
      const listSpy = jest.spyOn(transactionRepository, 'list');

      const payload = new ListTransactionsParamsDto(
        'some account',
        new Date(),
        new Date(),
        10,
        SortType.DESC,
        0,
      );

      const promise = listTransactionsService.invoke(payload);

      await expect(promise).resolves.toEqual([
        new TransactionDto(
          1,
          'some id',
          10,
          TransactionStatus.APPROVED,
          new Date(),
        ),
      ]);
      expect(listSpy).toHaveBeenNthCalledWith(1, payload);
    });
  });
});
