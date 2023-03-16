import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { DataSource, MoreThan } from 'typeorm';
import { HttpExceptionFilter } from 'src/infra/filters/http-exception.filter';
import { HistoryEntity } from 'src/infra/db/entities/history.entity';
import { AccountEntity } from 'src/infra/db/entities/account.entity';

describe('Deposit (e2e)', () => {
  let app: INestApplication;
  let repository: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = app.get(DataSource);
  });

  beforeEach(async () => {
    await repository.createQueryRunner().query('DELETE FROM transaction');
    await repository.getRepository(HistoryEntity).delete({ id: MoreThan(0) });
    await repository.getRepository(AccountEntity).delete({ id: '12345' });

    await repository.getRepository(AccountEntity).insert({
      id: '12345',
      amount: 10,
      isEnabled: true,
      name: 'Guilherme',
      version: 1,
    });
  });

  afterAll(async () => {
    await repository.createQueryRunner().query('DELETE FROM transaction');
    await repository.getRepository(HistoryEntity).delete({ id: MoreThan(0) });
    await repository.getRepository(AccountEntity).delete({ id: '12345' });

    await app.close();
  });

  describe('POST /v1/cash-flow/deposit', () => {
    it('should execute successfully', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/deposit')
        .send({ accountId: '12345', amount: 5 });

      expect(statusCode).toEqual(201);
      expect(body).toEqual({});
    });

    it('should throw when body is empty', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/deposit')
        .send({});

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);

      const expectedErrorMessages = [
        'accountId must be longer than or equal to 5 characters',
        'accountId should not be empty',
        'amount must not be greater than 1000',
        'amount must not be less than 1',
        'amount should not be empty',
      ];

      body.message.sort();
      expectedErrorMessages.sort();

      expect(body.message).toEqual(expectedErrorMessages);
    });

    it('should throw when account does not exist', async () => {
      await repository.getRepository(AccountEntity).delete({ id: '12345' });

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/deposit')
        .send({ accountId: '12345', amount: 5 });

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);

      expect(body.message).toEqual('Account does not exist');
    });

    it('should throw when account is not enabled', async () => {
      await repository
        .getRepository(AccountEntity)
        .update({ id: '12345' }, { isEnabled: false });

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/deposit')
        .send({ accountId: '12345', amount: 5 });

      expect(statusCode).toEqual(422);
      expect(body.statusCode).toEqual(422);

      expect(body.message).toEqual('Account is not enabled');
    });
  });
});
