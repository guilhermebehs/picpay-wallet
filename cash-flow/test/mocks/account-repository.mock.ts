import { AccountDto } from 'src/dtos';

export const accountRepositoryMock = {
  getByAccount: async (account: string) =>
    new AccountDto('some id', 'some name', 10, true),
  update: jest.fn(),
  create: jest.fn(),
};
