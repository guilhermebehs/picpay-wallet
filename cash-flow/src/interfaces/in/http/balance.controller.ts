import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BalanceDto, ClientErrorDto } from 'src/dtos';
import { BalanceService } from 'src/services/balance.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

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
    return await this.balanceService.invoke(account);
  }
}
