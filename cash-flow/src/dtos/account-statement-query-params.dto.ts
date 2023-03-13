import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { SortType } from 'src/enums/sort-type.enum';

export class AccountStatementQueryParamsDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(20)
  @IsNumber()
  limit = 20;

  @IsOptional()
  @IsEnum(SortType)
  sort: SortType = SortType.DESC;

  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(0)
  @IsNumber()
  offset = 0;
}
