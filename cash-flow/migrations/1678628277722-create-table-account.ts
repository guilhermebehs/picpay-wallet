import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableAccount1678628277722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE account (
        id varchar(10) NOT NULL, 
        name varchar(50) NOT NULL, 
        amount decimal(10, 2) NOT NULL, 
        is_enabled bool NOT NULL, 
        PRIMARY KEY (id))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE account');
  }
}
