import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableTransaction1678814984624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE transaction (
         id bigint NOT NULL AUTO_INCREMENT, 
         account varchar(10) NOT NULL, 
         amount decimal(10, 2) NOT NULL, 
         status varchar(20) NOT NULL, 
         date timestamp NOT NULL DEFAULT now(), 
         PRIMARY KEY (id))`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction
        ADD CONSTRAINT transaction_account_fk FOREIGN KEY (account) REFERENCES account(id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE transaction DROP FOREIGN KEY transaction_account_fk',
    );
    await queryRunner.query('DROP TABLE transaction');
  }
}
