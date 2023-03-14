import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { CashWithdrawDto, ClientErrorDto } from 'src/dtos';
import { CashWithdrawService } from 'src/services/cash-withdraw.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/withdraw')
export class CashWithdrawController {
  constructor(private readonly cashWithdrawService: CashWithdrawService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Withdraw succeeded',
  })
  @ApiBadRequestResponse({
    description: 'Account does not exist',
    type: ClientErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Account not enabled',
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Execute withdraw' })
  public async invoke(@Body() cashWithdrawDto: CashWithdrawDto) {
    await this.cashWithdrawService.invoke(cashWithdrawDto);
  }
}
