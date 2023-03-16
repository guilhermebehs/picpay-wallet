import { Controller, HttpCode, Inject, Param, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Logger } from 'src/contracts';
import { CancelTransactionDto } from 'src/dtos';
import { ClientErrorDto } from 'src/dtos/client-error.dto';
import { CancelTransactionService } from 'src/services/cancel-transaction.service';

@ApiTags('transactions')
@Controller('v1/transactions')
export class CancelTransactionController {
  constructor(
    private readonly cancelTransactionService: CancelTransactionService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @Patch(':transactionId/accounts/:accountId/cancel')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Transaction canceled',
  })
  @ApiNotFoundResponse({
    description: 'Transaction does not exist',
    type: ClientErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Transaction with some status can not be canceled',
    type: ClientErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'Account can not cancel some transaction',
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Cancel transaction' })
  public async invoke(@Param() cancelTransactionDto: CancelTransactionDto) {
    const endpoint = `v1/transactions/${cancelTransactionDto.transactionId}/accounts/${cancelTransactionDto.accountId}/cancel`;
    this.logger.print(endpoint, '{}');
    return await this.cancelTransactionService.invoke(cancelTransactionDto);
  }
}
