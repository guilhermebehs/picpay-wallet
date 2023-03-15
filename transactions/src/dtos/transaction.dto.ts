import { TransactionStatus } from 'src/enums/transaction-status.enum';

export class TransactionDto {
  id: number;
  account: string;
  amount: number;
  status: TransactionStatus;
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
