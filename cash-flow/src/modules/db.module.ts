import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infra/db/entities/account.entity';
import { config } from 'dotenv';
import { SqlAccountRepository } from './infra/db/repositories/sql-account-repository';
import { HistoryEntity } from './infra/db/entities/history.entity';
import { SqlHistoryRepository } from './infra/db/repositories/sql-history-repository';
import { AccountStatementEntity } from 'src/infra/db/entities/account-statement.entity';

config();

const providersList = [
  { provide: 'AccountRepository', useClass: SqlAccountRepository },
  { provide: 'HistoryRepository', useClass: SqlHistoryRepository },
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      AccountEntity,
      HistoryEntity,
      AccountStatementEntity,
    ]),
  ],
  providers: providersList,
  exports: providersList,
})
export class DbModule {}
