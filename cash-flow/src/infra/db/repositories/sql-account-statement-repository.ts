import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatementRepository } from 'src/contracts';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { Between, Repository } from 'typeorm';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class SqlAccountStatementRepository
  implements AccountStatementRepository
{
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly accountStatementRepository: Repository<HistoryEntity>,
  ) {}
  async find(
    params: AccountStatementParamsDto,
  ): Promise<AccountStatementDto[]> {
    const { account, startDate, endDate, limit, offset, sort } = params;

    const result = await this.accountStatementRepository.find({
      where: { account, date: Between(startDate, endDate) },
      skip: offset,
      take: limit,
      order: {
        date: sort,
      },
    });

    return result.map(
      ({ oldAmount, newAmount, type, date }) =>
        new AccountStatementDto(
          type,
          date,
          Math.abs(newAmount - oldAmount),
          newAmount,
        ),
    );
  }
}
