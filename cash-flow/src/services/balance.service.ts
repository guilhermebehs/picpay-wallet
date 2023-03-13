import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/contracts';
import { BalanceDto } from 'src/dtos';

@Injectable()
export class BalanceService {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
  ) {}

  async invoke(accountId: string): Promise<BalanceDto> {
    const account = await this.accountRepository.getByAccount(accountId);
    if (!account) throw new NotFoundException('Account does not exist');

    return { amount: account.amount };
  }
}
