import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CashWithdrawDto {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  constructor(accountId: string, amount: number) {
    this.accountId = accountId;
    this.amount = amount;
  }
}
