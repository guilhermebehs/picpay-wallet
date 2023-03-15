import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountDto } from 'src/dtos';
import { AccountEntity } from 'src/infra/db/entities/account.entity';
import { SqlAccountRepository } from 'src/infra/db/repositories/sql-account-repository';

describe('SqlAccountRepository', () => {
  let app: INestApplication;
  let sqlAccountRepository: SqlAccountRepository;
  let repository;
  const account: AccountEntity = {
    id: 'some id',
    name: 'some name',
    amount: 10,
    isEnabled: true,
    version: 1,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SqlAccountRepository,
        {
          provide: 'AccountEntityRepository',
          useValue: { findOneBy: () => account, save: jest.fn() },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sqlAccountRepository = app.get<SqlAccountRepository>(SqlAccountRepository);
    repository = app.get<'AccountEntityRepository'>('AccountEntityRepository');
  });

  describe('getByAccount()', () => {
    it('should return an account when repository returns an account', async () => {
      const findOneBySpy = jest.spyOn(repository, 'findOneBy');
      const promise = sqlAccountRepository.getByAccount('some id');
      await expect(promise).resolves.toEqual({
        id: 'some id',
        name: 'some name',
        amount: 10,
        isEnabled: true,
        version: 1,
      });
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 'some id' });
    });
    it('should return null when repository returns null', async () => {
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null);
      const promise = sqlAccountRepository.getByAccount('some id');
      await expect(promise).resolves.toBeNull();
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 'some id' });
    });
  });

  describe('create()', () => {
    it('should execute successfully', async () => {
      const saveSpy = jest.spyOn(repository, 'save');
      const promise = sqlAccountRepository.create(
        new CreateAccountDto('some id', 'some name'),
      );
      await expect(promise).resolves.toBeUndefined();
      expect(saveSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        name: 'some name',
        amount: 0,
        isEnabled: true,
      });
    });
  });

  describe('update()', () => {
    it('should execute successfully', async () => {
      const saveSpy = jest.spyOn(repository, 'save');
      const findOneBySpy = jest.spyOn(repository, 'findOneBy');
      const promise = sqlAccountRepository.update(account);
      await expect(promise).resolves.toBeUndefined();
      expect(saveSpy).toHaveBeenNthCalledWith(1, {
        id: 'some id',
        name: 'some name',
        amount: 10,
        isEnabled: true,
        version: 1,
      });
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 'some id' });
    });

    it('should throw when occurs a concurrency problem', async () => {
      const saveSpy = jest.spyOn(repository, 'save');
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce({
          id: 'some id',
          name: 'some name',
          amount: 10,
          isEnabled: true,
          version: 2,
        });
      const promise = sqlAccountRepository.update(account);
      await expect(promise).rejects.toEqual(
        new InternalServerErrorException('optimistic locking error'),
      );
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(findOneBySpy).toHaveBeenNthCalledWith(1, { id: 'some id' });
    });
  });
});
