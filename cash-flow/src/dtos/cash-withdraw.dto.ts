import { IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CashWithdrawDto {
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  amount: number;

  constructor(accountId: string, amount: number) {
    this.accountId = accountId;
    this.amount = amount;
  }
}
