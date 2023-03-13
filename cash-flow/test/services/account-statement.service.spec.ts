import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountStatementParamsDto } from 'src/dtos';
import { SortType } from 'src/enums/sort-type.enum';
import { AccountStatementService } from 'src/services/account-statement.service';
import { accountStatementRepositoryMock } from 'test/mocks';

describe('AccountStatementService', () => {
  let app: INestApplication;
  let accountStatementService: AccountStatementService;
  let accountStatementRepository;

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date());

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AccountStatementService,
        {
          provide: 'AccountStatementRepository',
          useValue: accountStatementRepositoryMock(),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    accountStatementService = app.get<AccountStatementService>(
      AccountStatementService,
    );
    accountStatementRepository = app.get('AccountStatementRepository');
  });

  describe('invoke()', () => {
    it('should retrieve data successfully', async () => {
      const params = new AccountStatementParamsDto(
        'some id',
        new Date(),
        new Date(),
        1,
        SortType.DESC,
        0,
      );
      const findSpy = jest.spyOn(accountStatementRepository, 'find');
      const promise = accountStatementService.invoke(params);

      await expect(promise).resolves.toEqual([
        accountStatementRepositoryMock().accountStatementRepositoryData,
      ]);
      expect(findSpy).toHaveBeenNthCalledWith(1, params);
    });
  });
});
