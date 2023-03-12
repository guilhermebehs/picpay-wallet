import { IsNotEmpty, Length } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  constructor(accountId: string, name: string) {
    this.accountId = accountId;
    this.name = name;
  }
}
