import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListTransactionsParamsDto,
  ListTransactionsQueryParamsDto,
  ListTransactionsUrlParamsDto,
  TransactionDto,
} from 'src/dtos';

import { SortType } from 'src/enums/sort-type.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { ListTransactionsController } from 'src/interfaces/in/http/list-transactions.controller';
import { ListTransactionsService } from 'src/services/list-transactions.service';
import { loggerMock } from 'test/mocks';

describe('ListTransactionsController', () => {
  let app: INestApplication;
  let listTransactionsController: ListTransactionsController;
  let listTransactionsService: ListTransactionsService;
  let logger;
  const data = new TransactionDto(
    1,
    'some id',
    10,
    TransactionStatus.APPROVED,
    new Date(),
  );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ListTransactionsController],
      providers: [
        {
          provide: ListTransactionsService,
          useValue: { invoke: () => [data] },
        },
        {
          provide: 'Logger',
          useValue: loggerMock,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    listTransactionsController = app.get<ListTransactionsController>(
      ListTransactionsController,
    );
    listTransactionsService = app.get<ListTransactionsService>(
      ListTransactionsService,
    );
    logger = app.get('Logger');
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(listTransactionsService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const urlParams: ListTransactionsUrlParamsDto = {
        account: 'some id',
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams: ListTransactionsQueryParamsDto = {
        sort: SortType.DESC,
        limit: 10,
        offset: 0,
      };

      const params = new ListTransactionsParamsDto(
        urlParams.account,
        new Date(urlParams.startDate),
        new Date(urlParams.endDate),
        queryParams.limit,
        queryParams.sort,
        queryParams.offset,
      );

      const promise = listTransactionsController.invoke(urlParams, queryParams);
      await expect(promise).resolves.toEqual([data]);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, params);
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/transactions/account/${urlParams.account}/start-date/${urlParams.startDate}/end-date/${urlParams.endDate}`,
        JSON.stringify(params),
      );
    });

    it('should process with default query params successfully', async () => {
      const invokeSpy = jest.spyOn(listTransactionsService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');
      const urlParams: ListTransactionsUrlParamsDto = {
        account: 'some id',
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams = new ListTransactionsQueryParamsDto();

      const promise = listTransactionsController.invoke(urlParams, queryParams);
      await expect(promise).resolves.toEqual([data]);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, {
        account: urlParams.account,
        startDate: new Date(urlParams.startDate),
        endDate: new Date(urlParams.endDate),
        limit: 20,
        sort: SortType.DESC,
        offset: 0,
      });
      expect(printSpy).toHaveBeenNthCalledWith(
        1,
        `v1/transactions/account/${urlParams.account}/start-date/${urlParams.startDate}/end-date/${urlParams.endDate}`,
        JSON.stringify({
          account: urlParams.account,
          startDate: new Date(urlParams.startDate),
          endDate: new Date(urlParams.endDate),
          limit: 20,
          sort: SortType.DESC,
          offset: 0,
        }),
      );
    });

    it('should throw when startDate is after endDate', async () => {
      const invokeSpy = jest.spyOn(listTransactionsService, 'invoke');
      const printSpy = jest.spyOn(logger, 'print');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const urlParams: ListTransactionsUrlParamsDto = {
        account: 'some id',
        startDate: startDate.toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams: ListTransactionsQueryParamsDto = {
        sort: SortType.DESC,
        limit: 10,
        offset: 0,
      };

      const promise = listTransactionsController.invoke(urlParams, queryParams);
      await expect(promise).rejects.toEqual(
        new BadRequestException("'startDate' should not be after 'endDate'"),
      );
      expect(invokeSpy).toHaveBeenCalledTimes(0);
      expect(printSpy).toHaveBeenCalledTimes(0);
    });
  });
});
