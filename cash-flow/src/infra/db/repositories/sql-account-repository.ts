import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'src/contracts';
import { AccountDto, CreateAccountDto } from 'src/dtos';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class SqlAccountRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getByAccount(account: string): Promise<AccountDto> {
    const result = await this.accountRepository.findOneBy({ id: account });
    if (!result) return null;

    const { id, amount, name, isEnabled } = result;
    return new AccountDto(id, name, amount, isEnabled);
  }

  async create(data: CreateAccountDto): Promise<void> {
    const { accountId: id, name } = data;
    const entity: AccountEntity = { id, name, amount: 0, isEnabled: true };
    await this.accountRepository.save(entity);
  }

  async update(data: AccountDto): Promise<void> {
    await this.accountRepository.save(data);
  }
}
