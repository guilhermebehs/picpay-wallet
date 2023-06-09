import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { createTableAccount1678628277722 } from './migrations/1678628277722-create-table-account';
import { createTableHistory1678644934982 } from './migrations/1678644934982-create-table-history';
import { alterTableAccount1678909316093 } from './migrations/1678909316093-alter-table-account';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [
    createTableAccount1678628277722,
    createTableHistory1678644934982,
    alterTableAccount1678909316093,
  ],
});
