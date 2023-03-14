import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CashDepositDto {
  @ApiProperty({
    description: 'account id',
    minLength: 5,
    maxLength: 10,
  })
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  @ApiProperty({
    description: 'amount to execute deposit',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  amount: number;

  constructor(accountId: string, amount: number) {
    this.accountId = accountId;
    this.amount = amount;
  }
}
