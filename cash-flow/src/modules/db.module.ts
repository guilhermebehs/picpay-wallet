import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AccountEntity } from 'src/infra/db/entities/account.entity';
import { HistoryEntity } from 'src/infra/db/entities/history.entity';
import { SqlAccountRepository } from 'src/infra/db/repositories/sql-account-repository';
import { SqlAccountStatementRepository } from 'src/infra/db/repositories/sql-account-statement-repository';
import { SqlHistoryRepository } from 'src/infra/db/repositories/sql-history-repository';

config();

const providersList = [
  { provide: 'AccountRepository', useClass: SqlAccountRepository },
  {
    provide: 'AccountStatementRepository',
    useClass: SqlAccountStatementRepository,
  },
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
    TypeOrmModule.forFeature([AccountEntity, HistoryEntity]),
  ],
  providers: providersList,
  exports: providersList,
})
export class DbModule {}
