import { AccountDto } from 'src/dtos/account.dto';

export interface AccountRepository {
  getByAccount(account: string): Promise<AccountDto>;
  update(data: AccountDto): Promise<void>;
}
