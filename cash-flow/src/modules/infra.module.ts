import { Module } from '@nestjs/common';
import { ConsoleLogger } from 'src/infra/log/console-logger';
import { DbModule } from './db.module';

const providersList = [
  {
    provide: 'Logger',
    useClass: ConsoleLogger,
  },
];
@Module({
  imports: [DbModule],
  controllers: [],
  providers: [...providersList],
  exports: [DbModule, ...providersList],
})
export class InfraModule {}
