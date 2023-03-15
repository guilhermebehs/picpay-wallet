import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreatedDto {
  @ApiProperty({
    description: 'transacion id generated after creation',
  })
  transactionId: number;
}
