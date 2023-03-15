import {
  BadRequestException,
  Controller,
  Get,
  Inject,
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
import { Logger } from 'src/contracts';
import {
  ListTransactionsParamsDto,
  ListTransactionsQueryParamsDto,
  ListTransactionsUrlParamsDto,
  TransactionDto,
} from 'src/dtos';
import { ClientErrorDto } from 'src/dtos/client-error.dto';
import { ListTransactionsService } from 'src/services/list-transactions.service';

@ApiTags('transactions')
@Controller('v1/transactions')
export class ListTransactionsController {
  constructor(
    private readonly listTransactionsService: ListTransactionsService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @ApiOkResponse({
    description: 'Transactions retrieved',
    type: [TransactionDto],
  })
  @ApiBadRequestResponse({
    description: "Invalid 'startDate' param",
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Return transactions' })
  @Get('account/:account/start-date/:startDate/end-date/:endDate')
  public async invoke(
    @Param() urlParams: ListTransactionsUrlParamsDto,
    @Query() queryParams: ListTransactionsQueryParamsDto,
  ) {
    const { account, startDate, endDate } = urlParams;
    const { limit, sort, offset } = queryParams;

    const startDateDt = new Date(startDate);
    const endDateDt = new Date(endDate);

    if (startDateDt.getTime() > endDateDt.getTime())
      throw new BadRequestException(
        "'startDate' should not be after 'endDate'",
      );

    const listTransactionsParamsDto = new ListTransactionsParamsDto(
      account,
      startDateDt,
      endDateDt,
      limit,
      sort,
      offset,
    );

    this.logger.print(
      `v1/transactions/account/${account}/start-date/${startDate}/end-date/${endDate}`,
      JSON.stringify(listTransactionsParamsDto),
    );
    return await this.listTransactionsService.invoke(listTransactionsParamsDto);
  }
}
