import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { Logger } from 'src/contracts';
import { CashDepositDto, ClientErrorDto } from 'src/dtos';
import { CashDepositService } from 'src/services/cash-deposit.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/deposit')
export class CashDepositController {
  constructor(
    private readonly cashDepositService: CashDepositService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Deposit succeeded',
  })
  @ApiBadRequestResponse({
    description: 'Account does not exist',
    type: ClientErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Account not enabled or does not have enough money',
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Execute deposit' })
  public async invoke(@Body() cashDepositDto: CashDepositDto) {
    this.logger.print(`v1/cash-flow/deposit`, JSON.stringify(cashDepositDto));
    await this.cashDepositService.invoke(cashDepositDto);
  }
}
