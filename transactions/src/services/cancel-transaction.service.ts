import { Inject, Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common/exceptions';
import { TransactionNotifier, TransactionRepository } from 'src/contracts';
import { CancelTransactionDto, TransactionReceivedDto } from 'src/dtos';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';

@Injectable()
export class CancelTransactionService {
  constructor(
    @Inject('TransactionNotifier')
    private readonly transactionNotifier: TransactionNotifier,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async invoke(cancelTransactionDto: CancelTransactionDto): Promise<void> {
    const transaction = await this.transactionRepository.getById(
      cancelTransactionDto.transactionId,
    );

    if (!transaction) throw new NotFoundException('Transaction does not exist');
    if (transaction.account !== cancelTransactionDto.accountId)
      throw new ForbiddenException(
        'This account is not allowed to cancel this transaction',
      );
    if (transaction.status !== TransactionStatus.APPROVED)
      throw new UnprocessableEntityException(
        `Transaction with status '${transaction.status}' can not be canceled`,
      );

    const { account, amount } = transaction;

    await this.transactionNotifier.invoke(
      new TransactionReceivedDto(
        account,
        amount,
        TransactionType.CANCELLATION,
        new Date(),
      ),
    );

    transaction.status = TransactionStatus.CANCELED;

    await this.transactionRepository.update(transaction);
  }
}
