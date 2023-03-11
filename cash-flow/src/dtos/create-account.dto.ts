export class CreateAccountDto {
  accountId: string;
  name: string;

  constructor(accountId: string, name: string) {
    this.accountId = accountId;
    this.name = name;
  }
}
