import { CreateAccountDto } from 'src/dtos';
import { AccountDto } from 'src/dtos/account.dto';

export interface AccountRepository {
  getByAccount(account: string): Promise<AccountDto>;
  update(data: AccountDto): Promise<void>;
  create(data: CreateAccountDto): Promise<void>;
}
