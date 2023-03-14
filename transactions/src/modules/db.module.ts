import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { TransactionEntity } from 'src/infra/db/entities/transaction.entity';
import { SqlTransactionRepository } from 'src/infra/db/repositories/sql-transaction-repository';

config();

const providersList = [
  { provide: 'TransactionRepository', useClass: SqlTransactionRepository },
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
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  providers: providersList,
  exports: providersList,
})
export class DbModule {}
