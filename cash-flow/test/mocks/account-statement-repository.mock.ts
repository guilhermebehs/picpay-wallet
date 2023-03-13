import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { HistoryType } from 'src/enums/history-type.enum';

export const accountStatementRepositoryMock = () => ({
  accountStatementRepositoryData: new AccountStatementDto(
    HistoryType.DEPOSIT,
    new Date(),
    10,
    100,
  ),
  find: async (params: AccountStatementParamsDto) => [
    new AccountStatementDto(HistoryType.DEPOSIT, new Date(), 10, 100),
  ],
});
