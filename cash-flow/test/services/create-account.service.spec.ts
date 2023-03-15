import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository } from 'src/contracts';
import { CreateAccountDto } from 'src/dtos';
import { CreateAccountService } from 'src/services/create-account.service';
import { accountRepositoryMock } from 'test/mocks';

describe('CreateAccountService', () => {
  let app: INestApplication;
  let accountRepository;
  let createAccountService: CreateAccountService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountService,
        { provide: 'AccountRepository', useValue: accountRepositoryMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    createAccountService = app.get<CreateAccountService>(CreateAccountService);
    accountRepository = app.get<AccountRepository>('AccountRepository');
  });

  describe('invoke()', () => {
    it('should create account successfully', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(undefined);

      const createSpy = jest.spyOn(accountRepository, 'create');

      const promise = createAccountService.invoke(
        new CreateAccountDto('some id', 'some name'),
      );

      await expect(promise).resolves.toBeUndefined();
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(getByAccountSpy).toBeCalledWith('some id');
      expect(createSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledWith({
        accountId: 'some id',
        name: 'some name',
      });
    });
    it('should thrown when account already exists', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');

      const createSpy = jest.spyOn(accountRepository, 'create');

      const promise = createAccountService.invoke(
        new CreateAccountDto('some id', 'some name'),
      );

      await expect(promise).rejects.toEqual(
        new BadRequestException('Account already exists'),
      );
      expect(getByAccountSpy).toBeCalledTimes(1);
      expect(getByAccountSpy).toBeCalledWith('some id');
      expect(createSpy).toBeCalledTimes(0);
    });
  });
});
