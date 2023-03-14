import { ApiProperty } from '@nestjs/swagger';

export class BalanceDto {
  @ApiProperty({
    description: 'account current amount',
  })
  amount: number;

  @ApiProperty({
    description: 'account current status',
  })
  isEnabled: boolean;
}
