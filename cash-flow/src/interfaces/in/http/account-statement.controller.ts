import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementQueryParamsDto } from 'src/dtos/account-statement-query-params.dto';
import { AccountStatementUrlParamsDto } from 'src/dtos/account-statement-url-params.dto';
import { AccountStatementService } from 'src/services/account-statement.service';

@Controller('v1/cash-flow/account-statement')
export class AccountStatementController {
  constructor(
    private readonly accountStatementService: AccountStatementService,
  ) {}

  @Get(':account/start-date/:startDate/end-date/:endDate')
  public async invoke(
    @Param() urlParams: AccountStatementUrlParamsDto,
    @Query() queryParams: AccountStatementQueryParamsDto,
  ) {
    const { account, startDate, endDate } = urlParams;
    const { limit, sort, offset } = queryParams;

    const startDateDt = new Date(startDate);
    const endDateDt = new Date(endDate);

    if (startDateDt.getTime() > endDateDt.getTime())
      throw new BadRequestException(
        "'startDate' should not be after 'endDate'",
      );

    const accountStamentParamsDto = new AccountStatementParamsDto(
      account,
      startDateDt,
      endDateDt,
      limit,
      sort,
      offset,
    );

    return await this.accountStatementService.invoke(accountStamentParamsDto);
  }
}
