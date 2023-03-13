import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryRepository } from 'src/contracts';
import { AccountStatementParamsDto, HistoryDto } from 'src/dtos';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { Repository } from 'typeorm';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class SqlHistoryRepository implements HistoryRepository {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}
  async find(
    params: AccountStatementParamsDto,
  ): Promise<AccountStatementDto[]> {
    throw new Error('Method not implemented.');
  }
  async insert(data: HistoryDto): Promise<void> {
    await this.historyRepository.save(data);
  }
}
