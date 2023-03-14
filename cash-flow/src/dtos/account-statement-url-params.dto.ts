import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Length } from 'class-validator';

export class AccountStatementUrlParamsDto {
  @ApiProperty({
    description: 'account id to get statement from',
    minLength: 5,
    maxLength: 10,
  })
  @IsNotEmpty()
  @Length(5, 10)
  account: string;

  @ApiProperty({
    description: 'date to start taking statement from',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'limit date to taking statement from',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
