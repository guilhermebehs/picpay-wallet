import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { HistoryDto } from 'src/dtos/history-dto';

export interface HistoryRepository {
  insert(data: HistoryDto): Promise<void>;
  find(params: AccountStatementParamsDto): Promise<AccountStatementDto[]>;
}
