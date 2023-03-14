import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'amount payed',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  amount: number;

  @ApiProperty({
    description: 'account id',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  constructor(amount: number, accountId: string) {
    this.amount = amount;
    this.accountId = accountId;
  }
}
