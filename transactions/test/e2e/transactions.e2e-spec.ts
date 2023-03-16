import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { DataSource, MoreThan } from 'typeorm';
import { HttpExceptionFilter } from 'src/infra/filters/http-exception.filter';
import { TransactionEntity } from 'src/infra/db/entities/transaction.entity';

describe('Transactions (e2e)', () => {
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
    await repository
      .getRepository(TransactionEntity)
      .delete({ id: MoreThan(0) });

    await repository.createQueryRunner().query('DELETE FROM history');
    await repository.createQueryRunner().query('DELETE FROM account');
    await repository
      .createQueryRunner()
      .query("INSERT INTO account values ('12345', 'Guilherme', 10, 1, 1)");
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/transactions', () => {
    it('should execute successfully', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/transactions')
        .send({ accountId: '12345', amount: 10 });

      expect(statusCode).toEqual(201);
      expect(!isNaN(body.transactionId)).toBeTruthy();
    });
    it('should throw when body is empty', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/transactions')
        .send({});

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);

      const expectedErrorMessages = [
        'amount must not be greater than 1000',
        'amount must not be less than 1',
        'amount should not be empty',
        'accountId must be longer than or equal to 5 characters',
        'accountId should not be empty',
      ];

      body.message.sort();
      expectedErrorMessages.sort();

      expect(body.message).toEqual(expectedErrorMessages);
    });

    it('should throw when account does not exist', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/transactions')
        .send({ accountId: '123456', amount: 10 });

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);
      expect(body.message).toEqual('Account does not exist');
    });
  });
});
