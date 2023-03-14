import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreatedResponseDto {
  @ApiProperty({
    description: 'transacion id generated after creation',
  })
  transactionId: number;
}
