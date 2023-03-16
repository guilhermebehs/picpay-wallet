import { AccountDto } from 'src/dtos';

export interface AccountService {
  getByAccountId(accountId: string): Promise<AccountDto>;
}
