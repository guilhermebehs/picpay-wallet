import { TransactionType } from 'src/enums/transaction-type.enum';

export class TransactionReceivedDto {
  account: string;
  amount: number;
  type: TransactionType;
  ocurredOn: Date;
}
