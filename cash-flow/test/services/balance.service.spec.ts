import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from 'src/services/balance.service';
import { accountRepositoryMock } from 'test/mocks';

describe('BalanceService', () => {
  let app: INestApplication;
  let balanceService: BalanceService;
  let accountRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        { provide: 'AccountRepository', useValue: accountRepositoryMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    balanceService = app.get<BalanceService>(BalanceService);
    accountRepository = app.get('AccountRepository');
  });

  describe('invoke()', () => {
    it('should retrieve balance successfully', async () => {
      const getByAccountSpy = jest.spyOn(accountRepository, 'getByAccount');
      const promise = balanceService.invoke('12345');
      await expect(promise).resolves.toEqual({ amount: 10, isEnabled: true });
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, '12345');
    });
    it('should throw when account does not exist', async () => {
      const getByAccountSpy = jest
        .spyOn(accountRepository, 'getByAccount')
        .mockResolvedValueOnce(null);
      const promise = balanceService.invoke('12345');
      await expect(promise).rejects.toEqual(
        new NotFoundException('Account does not exist'),
      );
      expect(getByAccountSpy).toHaveBeenNthCalledWith(1, '12345');
    });
  });
});
