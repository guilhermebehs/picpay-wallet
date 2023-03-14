import { Controller, Inject, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Logger } from 'src/contracts';
import { CreateTransactionDto } from 'src/dtos';
import { ClientErrorDto } from 'src/dtos/client-error.dto';
import { CreateTransactionService } from 'src/services/create-transaction.service';

@ApiTags('transactions')
@Controller('v1/transactions')
export class CreateTransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Transaction created',
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
  @ApiOperation({ summary: 'Create transaction' })
  public async invoke(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.print(`v1/transactions`, JSON.stringify(createTransactionDto));
    return await this.createTransactionService.invoke(createTransactionDto);
  }
}
