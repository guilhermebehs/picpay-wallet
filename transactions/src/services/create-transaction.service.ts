import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AccountService,
  TransactionNotifier,
  TransactionRepository,
} from 'src/contracts';
import { CreateTransactionDto, TransactionCreatedResponseDto } from 'src/dtos';
import { TransactionType } from 'src/enums/transaction-type.enum';

@Injectable()
export class CreateTransactionService {
  constructor(
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('TransactionNotifier')
    private readonly transactionNotifier: TransactionNotifier,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async invoke(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionCreatedResponseDto> {
    const { accountId, amount } = createTransactionDto;

    const account = await this.accountService.getByAccountId(
      createTransactionDto.accountId,
    );
    if (!account) throw new BadRequestException('Account does not exist');
    if (!account.isEnabled)
      throw new UnprocessableEntityException('Account is not enabled');

    if (account.amount < createTransactionDto.amount)
      throw new UnprocessableEntityException(
        'Account does not have enough money',
      );

    account.amount -= createTransactionDto.amount;

    await this.transactionNotifier.invoke({
      account: accountId,
      ocurredOn: new Date(),
      amount,
      type: TransactionType.PURCHASE,
    });

    const transactionId = await this.transactionRepository.create(
      createTransactionDto,
    );

    const response: TransactionCreatedResponseDto = {
      transactionId,
    };

    return response;
  }
}
