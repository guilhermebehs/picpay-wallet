import { HistoryType } from 'src/enums/history-type.enum';

export class HistoryDto {
  account: string;
  oldAmount: number;
  newAmount: number;
  type: HistoryType;

  constructor(
    account: string,
    oldAmount: number,
    newAmount,
    type: HistoryType = HistoryType.DEPOSIT,
  ) {
    this.account = account;
    this.oldAmount = oldAmount;
    this.newAmount = newAmount;
    this.type = type;
  }
}
