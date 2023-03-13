import { HistoryType } from 'src/enums/history-type.enum';

export class AccountStatementDto {
  type: HistoryType;
  date: Date;
  value: number;
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
