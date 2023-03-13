import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';

export interface AccountStatementRepository {
  find(params: AccountStatementParamsDto): Promise<AccountStatementDto[]>;
}
