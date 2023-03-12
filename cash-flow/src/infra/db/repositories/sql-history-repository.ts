import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryRepository } from 'src/contracts';
import { HistoryDto } from 'src/dtos';
import { Repository } from 'typeorm';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class SqlHistoryRepository implements HistoryRepository {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}
  async insert(data: HistoryDto): Promise<void> {
    await this.historyRepository.save(data);
  }
}
