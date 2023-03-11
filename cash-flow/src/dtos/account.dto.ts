export class AccountDto {
  id: string;
  amount: number;
  isEnabled: boolean;

  constructor(id: string, amount: number, isEnabled: boolean) {
    this.id = id;
    this.amount = amount;
    this.isEnabled = isEnabled;
  }
}
