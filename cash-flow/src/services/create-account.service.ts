import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/contracts';
import { CreateAccountDto } from 'src/dtos';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
  ) {}

  async invoke(createAccountDto: CreateAccountDto): Promise<void> {
    const account = await this.accountRepository.getByAccount(
      createAccountDto.accountId,
    );

    if (account) throw new BadRequestException('Account already exists');

    await this.accountRepository.create(createAccountDto);
  }
}
