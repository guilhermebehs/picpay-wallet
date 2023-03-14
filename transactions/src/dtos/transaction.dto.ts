import { TransactionStatus } from 'src/enums/transaction-status.enum';

export class TransactionDto {
  id: number;
  account: string;
  amount: number;
  status: TransactionStatus;
  date: Date;
}
