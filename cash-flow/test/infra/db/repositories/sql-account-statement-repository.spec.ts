import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { HistoryType } from 'src/enums/history-type.enum';
import { SortType } from 'src/enums/sort-type.enum';
import { HistoryEntity } from 'src/infra/db/entities/history.entity';
import { SqlAccountStatementRepository } from 'src/infra/db/repositories/sql-account-statement-repository';
import { Between } from 'typeorm';

describe('SqlAccountStatementRepository', () => {
  let app: INestApplication;
  let sqlAccountStatementRepository: SqlAccountStatementRepository;
  let repository;
  const data: HistoryEntity = {
    account: 'some account',
    type: HistoryType.DEPOSIT,
    date: new Date(),
    oldAmount: 10,
    newAmount: 30,
  };
  const params = new AccountStatementParamsDto(
    'some id',
    new Date(),
    new Date(),
    1,
    SortType.DESC,
    0,
  );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SqlAccountStatementRepository,
        {
          provide: 'HistoryEntityRepository',
          useValue: { find: () => [data] },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sqlAccountStatementRepository = app.get<SqlAccountStatementRepository>(
      SqlAccountStatementRepository,
    );
    repository = app.get('HistoryEntityRepository');
  });

  describe('find()', () => {
    it('should return data successfully', async () => {
      const findSpy = jest.spyOn(repository, 'find');
      const promise = sqlAccountStatementRepository.find(params);
      const { account, startDate, endDate, limit, offset, sort } = params;

      await expect(promise).resolves.toEqual([
        new AccountStatementDto(
          data.type,
          data.date,
          Math.abs(data.newAmount - data.oldAmount),
          data.newAmount,
        ),
      ]);
      expect(findSpy).toHaveBeenNthCalledWith(1, {
        where: { account, date: Between(startDate, endDate) },
        skip: offset,
        take: limit,
        order: {
          date: sort,
        },
      });
    });
  });
});
