import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'src/contracts';
import { BalanceDto, ClientErrorDto } from 'src/dtos';
import { BalanceService } from 'src/services/balance.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/balance')
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @Get(':account')
  @ApiOkResponse({
    description: 'Balance retrived',
    type: BalanceDto,
  })
  @ApiNotFoundResponse({
    description: 'Account does not exist',
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Return account balance' })
  @ApiParam({ description: 'account to take balance from', name: 'account' })
  public async invoke(@Param('account') account) {
    this.logger.print(`v1/cash-flow/balance/${account}`, '{}');
    return await this.balanceService.invoke(account);
  }
}
