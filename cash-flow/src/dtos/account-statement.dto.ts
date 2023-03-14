import { ApiProperty } from '@nestjs/swagger';
import { HistoryType } from 'src/enums/history-type.enum';

export class AccountStatementDto {

  @ApiProperty({
    description: 'operation type',
  })
  type: HistoryType;

  @ApiProperty({
    description: 'operation date',
  })
  date: Date;

  @ApiProperty({
    description: 'amount added or subtracted at operation',
  })
  value: number;

  @ApiProperty({
    description: 'amount resulted after operation',
  })
  finalAmount: number;

  constructor(
    type: HistoryType,
    date: Date,
    value: number,
    finalAmount: number,
  ) {
    this.type = type;
    this.date = date;
    this.value = value;
    this.finalAmount = finalAmount;
  }
}
