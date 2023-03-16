import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger } from 'src/infra/log/console-logger';

describe('ConsoleLogger', () => {
  let app: INestApplication;
  let consoleLogger: ConsoleLogger;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [ConsoleLogger],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.useFakeTimers().setSystemTime(new Date());

    consoleLogger = app.get<ConsoleLogger>(ConsoleLogger);
  });

  describe('print()', () => {
    it('should print successfully', () => {
      const logSpy = jest.spyOn(console, 'log');
      expect(
        consoleLogger.print('some enpoint', 'some params'),
      ).toBeUndefined();
      expect(logSpy).toHaveBeenNthCalledWith(
        1,
        `[${new Date().toISOString()}] Request received at 'some enpoint' with params 'some params'`,
      );
    });
    it('should print error successfully', () => {
      const logSpy = jest.spyOn(console, 'error');
      expect(consoleLogger.error('some enpoint', 'some error')).toBeUndefined();
      expect(logSpy).toHaveBeenNthCalledWith(
        1,
        `[${new Date().toISOString()}] Error ocurred at 'some enpoint' with error 'some error'`,
      );
    });
  });
});
