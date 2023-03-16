import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/contracts';
import { ListTransactionsParamsDto, TransactionDto } from 'src/dtos';

@Injectable()
export class ListTransactionsService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async invoke(
    listTransactionParamsDto: ListTransactionsParamsDto,
  ): Promise<TransactionDto[]> {
    return await this.transactionRepository.list(listTransactionParamsDto);
  }
}
