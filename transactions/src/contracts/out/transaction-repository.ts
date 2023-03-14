import { CreateTransactionDto, TransactionDto } from 'src/dtos';

export interface TransactionRepository {
  getById(id: number): Promise<TransactionDto>;
  create(createTransactionDto: CreateTransactionDto): Promise<number>;
}
