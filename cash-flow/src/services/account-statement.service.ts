import { Inject, Injectable } from '@nestjs/common';
import { AccountStatementRepository } from 'src/contracts';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';

@Injectable()
export class AccountStatementService {
  constructor(
    @Inject('AccountStatementRepository')
    private readonly accountStatementRepository: AccountStatementRepository,
  ) {}

  async invoke(
    accountStatementParamsDto: AccountStatementParamsDto,
  ): Promise<AccountStatementDto[]> {
    return this.accountStatementRepository.find(accountStatementParamsDto);
  }
}
