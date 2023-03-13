import { Controller, Param, Post, Query } from '@nestjs/common';
import { AccountStatementParamsDto } from 'src/dtos';
import { AccountStatementService } from 'src/services/account-statement.service';

@Controller(
  'v1/cash-flow/account-statement/{account}/start-date/{startDate}/end-date/{endDate}',
)
export class CreateAccountController {
  constructor(
    private readonly accountStatementService: AccountStatementService,
  ) {}

  @Post()
  public async invoke(@Param() params, @Query() queryParams) {
    const { account, startDate, endDate } = params;
    const { limit, sort, offset } = queryParams;
    const accountStamentParamsDto = new AccountStatementParamsDto(
      account,
      startDate,
      endDate,
      limit,
      sort,
      offset,
    );

    return await this.accountStatementService.invoke(accountStamentParamsDto)
  }
}
