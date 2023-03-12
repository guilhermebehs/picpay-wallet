export class AccountDto {
  id: string;
  name: string;
  amount: number;
  isEnabled: boolean;

  constructor(id: string, name: string, amount: number, isEnabled: boolean) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.isEnabled = isEnabled;
  }
}
