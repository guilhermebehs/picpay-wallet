import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from 'src/contracts';
import {
  CreateTransactionDto,
  ListTransactionsParamsDto,
  TransactionDto,
} from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { Between, Repository } from 'typeorm';
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

  async list(
    listTransactionsParamsDto: ListTransactionsParamsDto,
  ): Promise<TransactionDto[]> {
    const { account, startDate, endDate, limit, offset, sort } =
      listTransactionsParamsDto;

    const result = await this.transactionRepository.find({
      where: { account, date: Between(startDate, endDate) },
      skip: offset,
      take: limit,
      order: {
        date: sort,
      },
    });

    return result.map(
      ({ account, amount, status, date, id }) =>
        new TransactionDto(id, account, amount, status, date),
    );
  }

  async create(data: CreateTransactionDto): Promise<number> {
    const entity: TransactionEntity = {
      ...data,
      account: data.accountId,
      status: TransactionStatus.APPROVED,
    };
    return (await this.transactionRepository.save(entity)).id;
  }

  async update(transactionDto: TransactionDto): Promise<void> {
    await this.transactionRepository.save(transactionDto);
  }
}
