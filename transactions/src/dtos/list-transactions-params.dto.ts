import {
  IsNotEmpty,
  Length,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { SortType } from 'src/enums/sort-type.enum';

export class ListTransactionsParamsDto {
  @IsNotEmpty()
  @Length(5, 10)
  account: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  @Min(1)
  @Max(20)
  limit: number;

  @IsOptional()
  @IsEnum(SortType)
  sort: SortType;

  @IsOptional()
  @Min(0)
  offset: number;

  constructor(
    account: string,
    startDate: Date,
    endDate: Date,
    limit: number,
    sort: SortType,
    offset: number,
  ) {
    this.account = account;
    this.startDate = startDate;
    this.endDate = endDate;
    this.limit = limit;
    this.sort = sort;
    this.offset = offset;
  }
}
