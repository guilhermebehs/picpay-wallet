import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HistoryDto } from 'src/dtos';
import { HistoryType } from 'src/enums/history-type.enum';
import { SqlHistoryRepository } from 'src/infra/db/repositories/sql-history-repository';

describe('SqlHistoryRepository', () => {
  let app: INestApplication;
  let sqlHistoryRepository: SqlHistoryRepository;
  let repository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SqlHistoryRepository,
        {
          provide: 'HistoryEntityRepository',
          useValue: { save: jest.fn() },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sqlHistoryRepository = app.get<SqlHistoryRepository>(SqlHistoryRepository);
    repository = app.get<'HistoryEntityRepository'>('HistoryEntityRepository');
  });

  describe('insert()', () => {
    it('should execute successfully', async () => {
      const history: HistoryDto = {
        account: 'some id',
        oldAmount: 10,
        newAmount: 15,
        type: HistoryType.DEPOSIT,
      };
      const saveSpy = jest.spyOn(repository, 'save');
      const promise = sqlHistoryRepository.insert(history);
      await expect(promise).resolves.toBeUndefined();
      expect(saveSpy).toHaveBeenNthCalledWith(1, history);
    });
  });
});
