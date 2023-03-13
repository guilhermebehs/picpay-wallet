import { Inject, Injectable } from '@nestjs/common';
import { HistoryRepository } from 'src/contracts';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';

@Injectable()
export class AccountStatementService {
  constructor(
    @Inject('HistoryRepository')
    private readonly historyRepository: HistoryRepository,
  ) {}

  async invoke(
    accountStatementParamsDto: AccountStatementParamsDto,
  ): Promise<AccountStatementDto[]> {
    return this.historyRepository.find(accountStatementParamsDto);
  }
}
