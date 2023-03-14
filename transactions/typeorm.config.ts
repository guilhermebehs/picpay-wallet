import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { createTableTransaction1678814984624 } from './migrations/1678814984624-create-table-transaction';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [createTableTransaction1678814984624],
});
