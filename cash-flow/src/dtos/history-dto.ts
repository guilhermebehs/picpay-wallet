export class HistoryDto {
  account: string;
  oldAmount: number;
  newAmount: number;

  constructor(account: string, oldAmount: number, newAmount) {
    this.account = account;
    this.oldAmount = oldAmount;
    this.newAmount = newAmount;
  }
}
