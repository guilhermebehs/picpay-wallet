import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'data order',
    required: false,
    default: SortType.DESC,
    enum: SortType,
  })
  @IsOptional()
  @IsEnum(SortType)
  sort: SortType = SortType.DESC;

  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(0)
  @IsNumber()
  offset = 0;

  @ApiProperty({
    description: 'data limit',
    minLength: 1,
    maxLength: 20,
    required: false,
    default: 20,
    name: 'limit',
  })
  private _limit?: number;

  @ApiProperty({
    description: 'position to start taking data from',
    required: false,
    default: 0,
    name: 'offset',
  })
  private _offset?: number;
}
