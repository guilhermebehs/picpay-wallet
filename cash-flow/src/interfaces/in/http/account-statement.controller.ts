import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountStatementParamsDto, ClientErrorDto } from 'src/dtos';
import { AccountStatementQueryParamsDto } from 'src/dtos/account-statement-query-params.dto';
import { AccountStatementUrlParamsDto } from 'src/dtos/account-statement-url-params.dto';
import { AccountStatementDto } from 'src/dtos/account-statement.dto';
import { AccountStatementService } from 'src/services/account-statement.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/account-statement')
export class AccountStatementController {
  constructor(
    private readonly accountStatementService: AccountStatementService,
  ) {}

  @ApiOkResponse({
    description: 'Account statement retrieved',
    type: [AccountStatementDto],
  })
  @ApiBadRequestResponse({
    description: "Invalid 'startDate' param",
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Return account statement' })
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
