import {
  CreateTransactionDto,
  ListTransactionsParamsDto,
  TransactionDto,
} from 'src/dtos';

export interface TransactionRepository {
  getById(id: number): Promise<TransactionDto>;
  create(createTransactionDto: CreateTransactionDto): Promise<number>;
  update(transactionDto: TransactionDto): Promise<void>;
  list(
    listTransactionParamsDto: ListTransactionsParamsDto,
  ): Promise<TransactionDto[]>;
}
