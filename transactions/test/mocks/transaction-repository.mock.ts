import { TransactionDto } from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';

export const transactionRepositoryMock = {
  create: () => 1,
  update: jest.fn(),
  getById: () =>
    new TransactionDto(
      1,
      'some id',
      10,
      TransactionStatus.APPROVED,
      new Date(),
    ),
};
