import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'unique account id',
    minLength: 5,
    maxLength: 10,
    nullable: false,
  })
  @IsNotEmpty()
  @Length(5, 10)
  accountId: string;

  @ApiProperty({
    description: 'account owner name',
    minLength: 5,
    maxLength: 50,
    nullable: false,
  })
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  constructor(accountId: string, name: string) {
    this.accountId = accountId;
    this.name = name;
  }
}
