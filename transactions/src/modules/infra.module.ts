import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConsoleLogger } from 'src/infra/log/console-logger';
import { HttpAccountService } from 'src/interfaces/out/http/http-account.service';
import { DbModule } from './db.module';
import { MessagingModule } from './messaging.module';

const providersList = [
  {
    provide: 'Logger',
    useClass: ConsoleLogger,
  },
  {
    provide: 'AccountService',
    useClass: HttpAccountService,
  },
];
@Module({
  imports: [
    DbModule,
    MessagingModule,
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  controllers: [],
  providers: [...providersList],
  exports: [DbModule, MessagingModule, ...providersList],
})
export class InfraModule {}
