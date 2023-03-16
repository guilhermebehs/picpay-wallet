import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TransactionStatus } from 'src/enums/transaction-status.enum';

export class TransactionDto {

  @ApiProperty({
    description: 'transaction id',
  })
  id: number;

  @ApiProperty({
    description: 'account id',
  })
  account: string;

  @ApiProperty({
    description: 'transaction amount',
  })
  amount: number;

  @ApiProperty({
    description: 'transaction status',
    enum: TransactionStatus
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'transaction date',
  })
  date: Date;

  constructor(
    id: number,
    account: string,
    amount: number,
    status: TransactionStatus,
    date: Date,
  ) {
    this.id = id;
    this.account = account;
    this.amount = amount;
    this.status = status;
    this.date = date;
  }
}
