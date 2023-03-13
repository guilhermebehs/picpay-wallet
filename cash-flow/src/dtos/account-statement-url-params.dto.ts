import { IsDateString, IsNotEmpty, Length } from 'class-validator';

export class AccountStatementUrlParamsDto {
  @IsNotEmpty()
  @Length(5, 10)
  account: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
