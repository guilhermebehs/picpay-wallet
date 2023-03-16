import { AccountDto } from 'src/dtos';

export const accountRepositoryMock = {
  getByAccount: async (account: string) =>
    new AccountDto('some id', 'some name', 10, true, 1),
  update: jest.fn(),
  create: jest.fn(),
};
