import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AccountRepository, HistoryRepository } from 'src/contracts';
import { HistoryDto } from 'src/dtos';
import { CashWithdrawDto } from 'src/dtos/cash-withdraw.dto';
import { HistoryType } from 'src/enums/history-type.enum';

@Injectable()
export class CashWithdrawService {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('HistoryRepository')
    private readonly historyRepository: HistoryRepository,
  ) {}

  async invoke(cashwithdrawDto: CashWithdrawDto): Promise<void> {
    const account = await this.accountRepository.getByAccount(
      cashwithdrawDto.accountId,
    );

    if (!account) throw new BadRequestException('Account does not exist');
    if (!account.isEnabled)
      throw new UnprocessableEntityException('Account is not enabled');

    if (account.amount < cashwithdrawDto.amount)
      throw new UnprocessableEntityException(
        'Account does not have enough money',
      );

    const oldAmount = account.amount;

    account.amount -= cashwithdrawDto.amount;

    await this.accountRepository.update(account);

    await this.historyRepository.insert(
      new HistoryDto(
        account.id,
        oldAmount,
        account.amount,
        HistoryType.WITHDRAW,
      ),
    );
  }
}
