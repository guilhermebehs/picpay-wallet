import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AccountService } from 'src/contracts';
import { AccountDto } from 'src/dtos';

@Injectable()
export class HttpAccountService implements AccountService {
  constructor(private readonly httpService: HttpService) {}
  async getByAccountId(accountId: string): Promise<AccountDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<AccountDto>(
            `${process.env.CASH_FLOW_URL}/v1/cash-flow/balance/${accountId}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw new InternalServerErrorException(error.message);
            }),
          ),
      );
      return data;
    } catch (e) {
      return null;
    }
  }
}
