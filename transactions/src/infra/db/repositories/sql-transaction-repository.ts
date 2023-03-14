import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from 'src/contracts';
import { CreateTransactionDto, TransactionDto } from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class SqlTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async getById(transactionId: number): Promise<TransactionDto> {
    const result = await this.transactionRepository.findOneBy({
      id: transactionId,
    });
    if (!result) return null;

    const { id, account, amount, status, date } = result;
    return { id, account, amount, date, status };
  }

  async create(data: CreateTransactionDto): Promise<number> {
    const entity: TransactionEntity = {
      ...data,
      account: data.accountId,
      status: TransactionStatus.APPROVED,
    };
    return (await this.transactionRepository.save(entity)).id;
  }
}
