import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { HttpExceptionFilter } from 'src/infra/filters/http-exception.filter';

describe('Account (e2e)', () => {
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
    await repository.createQueryRunner().query('DELETE FROM history');
    await repository.createQueryRunner().query('DELETE FROM account');
  });

  afterAll(async () => {
    await repository.createQueryRunner().query('DELETE FROM history');
    await repository.createQueryRunner().query('DELETE FROM account');
    await app.close();
  });

  describe('POST /v1/cash-flow/account', () => {
    it('should execute successfully', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/account')
        .send({ accountId: '12345', name: 'Guilherme' });

      expect(statusCode).toEqual(201);
      expect(body).toEqual({});
    });
    it('should throw when body is empty', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/account')
        .send({});

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);

      const expectedErrorMessages = [
        'accountId must be longer than or equal to 5 characters',
        'accountId should not be empty',
        'name must be longer than or equal to 5 characters',
        'name should not be empty',
      ];

      body.message.sort();
      expectedErrorMessages.sort();

      expect(body.message).toEqual(expectedErrorMessages);
    });

    it('should throw when account already exists', async () => {
      await repository
        .createQueryRunner()
        .query("INSERT INTO account values('12345', 'Guilherme', 0, 1, 1)");

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/v1/cash-flow/account')
        .send({ accountId: '12345', name: 'Guilherme' });

      expect(statusCode).toEqual(400);
      expect(body.statusCode).toEqual(400);

      expect(body.message).toEqual('Account already exists');
    });
  });
});
