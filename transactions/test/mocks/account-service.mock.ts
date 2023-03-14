export const accountServiceMock = {
  getByAccountId: async () => ({
    id: 'some id',
    name: 'some name',
    amount: 100,
    isEnabled: true,
  }),
};
