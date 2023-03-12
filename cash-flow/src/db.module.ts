import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infra/db/entities/account.entity';
import { config } from 'dotenv';
import { SqlAccountRepository } from './infra/db/repositories/sql-account-repository';

config();

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
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  providers: [{ provide: 'AccountRepository', useClass: SqlAccountRepository }],
  exports: [{ provide: 'AccountRepository', useClass: SqlAccountRepository }],
})
export class DbModule {}
