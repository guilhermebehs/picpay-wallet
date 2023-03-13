import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementQueryParamsDto } from 'src/dtos/account-statement-query-params.dto';
import { AccountStatementUrlParamsDto } from 'src/dtos/account-statement-url-params.dto';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { HistoryType } from 'src/enums/history-type.enum';
import { SortType } from 'src/enums/sort-type.enum';
import { AccountStatementController } from 'src/interfaces/in/http/account-statement.controller';
import { AccountStatementService } from 'src/services/account-statement.service';

describe('AccountStatementController', () => {
  let app: INestApplication;
  let accountStatementController: AccountStatementController;
  let accountStatementService: AccountStatementService;
  const data = new AccountStatementDto(
    HistoryType.DEPOSIT,
    new Date(),
    10,
    100,
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AccountStatementController],
      providers: [
        {
          provide: AccountStatementService,
          useValue: { invoke: () => [data] },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    accountStatementController = app.get<AccountStatementController>(
      AccountStatementController,
    );
    accountStatementService = app.get<AccountStatementService>(
      AccountStatementService,
    );
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(accountStatementService, 'invoke');
      const urlParams: AccountStatementUrlParamsDto = {
        account: 'some id',
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams: AccountStatementQueryParamsDto = {
        sort: SortType.DESC,
        limit: 10,
        offset: 0,
      };

      const params = new AccountStatementParamsDto(
        urlParams.account,
        new Date(urlParams.startDate),
        new Date(urlParams.endDate),
        queryParams.limit,
        queryParams.sort,
        queryParams.offset,
      );

      const promise = accountStatementController.invoke(urlParams, queryParams);
      await expect(promise).resolves.toEqual([data]);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, params);
    });

    it('should process with default query params successfully', async () => {
      const invokeSpy = jest.spyOn(accountStatementService, 'invoke');
      const urlParams: AccountStatementUrlParamsDto = {
        account: 'some id',
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams = new AccountStatementQueryParamsDto();

      const promise = accountStatementController.invoke(urlParams, queryParams);
      await expect(promise).resolves.toEqual([data]);
      expect(invokeSpy).toHaveBeenNthCalledWith(1, {
        account: urlParams.account,
        startDate: new Date(urlParams.startDate),
        endDate: new Date(urlParams.endDate),
        limit: 20,
        sort: SortType.DESC,
        offset: 0,
      });
    });

    it('should throw when startDate is after endDate', async () => {
      const invokeSpy = jest.spyOn(accountStatementService, 'invoke');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const urlParams: AccountStatementUrlParamsDto = {
        account: 'some id',
        startDate: startDate.toDateString(),
        endDate: new Date().toDateString(),
      };
      const queryParams: AccountStatementQueryParamsDto = {
        sort: SortType.DESC,
        limit: 10,
        offset: 0,
      };

      const promise = accountStatementController.invoke(urlParams, queryParams);
      await expect(promise).rejects.toEqual(
        new BadRequestException("'startDate' should not be after 'endDate'"),
      );
      expect(invokeSpy).toHaveBeenCalledTimes(0);
    });
  });
});
