import { TransactionType } from 'src/enums/transaction-type.enum';

export class TransactionReceivedDto {
  account: string;
  amount: number;
  type: TransactionType;
  ocurredOn: Date;

  constructor(
    account: string,
    amount: number,
    type: TransactionType,
    ocurredOn: Date,
  ) {
    this.account = account;
    this.amount = amount;
    this.type = type;
    this.ocurredOn = ocurredOn;
  }
}
