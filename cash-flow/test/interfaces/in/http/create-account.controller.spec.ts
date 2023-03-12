import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountDto } from 'src/dtos';
import { CreateAccountController } from 'src/interfaces/in/http/create-account.controller';
import { CreateAccountService } from 'src/services/create-account.service';

describe('CreateAccountController', () => {
  let app: INestApplication;
  let createAccountController: CreateAccountController;
  let createAccountService: CreateAccountService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        { provide: CreateAccountService, useValue: { invoke: jest.fn() } },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    createAccountController = app.get<CreateAccountController>(
      CreateAccountController,
    );
    createAccountService = app.get<CreateAccountService>(CreateAccountService);
  });

  describe('invoke()', () => {
    it('should process successfully', async () => {
      const invokeSpy = jest.spyOn(createAccountService, 'invoke');
      const payload = new CreateAccountDto('12345', 'Guilherme');
      const promise = createAccountController.invoke(payload);
      await expect(promise).resolves.toBeUndefined();
      expect(invokeSpy).toHaveBeenNthCalledWith(1, payload);
    });
  });
});
