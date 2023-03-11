import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AccountRepository, HistoryRepository } from 'src/contracts';
import { CashDepositDto, HistoryDto } from 'src/dtos';

@Injectable()
export class CashDepositService {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('HistoryRepository')
    private readonly historyRepository: HistoryRepository,
  ) {}

  async invoke(cashDepositDto: CashDepositDto): Promise<void> {
    const account = await this.accountRepository.getByAccount(
      cashDepositDto.accountId,
    );

    if (!account) throw new BadRequestException('Account does not exist');
    if (!account.isEnabled)
      throw new UnprocessableEntityException('Account is not enabled');

    const oldAmount = account.amount;

    account.amount += cashDepositDto.amount;

    await this.accountRepository.update(account);

    await this.historyRepository.insert(
      new HistoryDto(account.id, oldAmount, account.amount),
    );
  }
}
