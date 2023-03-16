export class AccountDto {
  id: string;
  name: string;
  amount: number;
  isEnabled: boolean;
  version?: number;

  constructor(
    id: string,
    name: string,
    amount: number,
    isEnabled: boolean,
    version?: number,
  ) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.isEnabled = isEnabled;
    this.version = version;
  }
}
