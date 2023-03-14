import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Logger } from 'src/contracts';
import { ClientErrorDto, CreateAccountDto } from 'src/dtos';
import { CreateAccountService } from 'src/services/create-account.service';

@ApiTags('cash-flow')
@Controller('v1/cash-flow/account')
export class CreateAccountController {
  constructor(
    private readonly createAccountService: CreateAccountService,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Account created',
  })
  @ApiBadRequestResponse({
    description: 'Account already exists',
    type: ClientErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Error',
  })
  @ApiOperation({ summary: 'Create account' })
  public async invoke(@Body() createAccountDto: CreateAccountDto) {
    this.logger.print(`v1/cash-flow/account`, JSON.stringify(createAccountDto));
    await this.createAccountService.invoke(createAccountDto);
  }
}
