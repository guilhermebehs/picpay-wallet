import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Length, Min } from 'class-validator';

export class CancelTransactionDto {
  @ApiProperty({
    description: 'account id',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  @ApiProperty({
    description: 'transaction id',
    minLength: 1,
  })
  @Transform(({ value }) => Number.parseInt(value))
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  transactionId: number;

  constructor(accountId: string, transactionId: number) {
    this.accountId = accountId;
    this.transactionId = transactionId;
  }
}
