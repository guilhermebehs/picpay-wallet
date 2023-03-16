import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableHistory1678644934982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE history (
        id bigint NOT NULL AUTO_INCREMENT, 
        account varchar(10) NOT NULL, 
        \`old-amount\` decimal(10, 2) NOT NULL, 
        \`new-amount\` decimal(10, 2) NOT NULL, 
        type varchar(20) NOT NULL, 
        date timestamp NOT NULL DEFAULT now(), 
        PRIMARY KEY (id))`,
    );
    await queryRunner.query(
      `ALTER TABLE history
       ADD CONSTRAINT history_account_fk FOREIGN KEY (account) REFERENCES account(id)`,
    );

    await queryRunner.query(
      `CREATE INDEX history_account_date_idx ON history (account, date)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE history DROP FOREIGN KEY history_account_fk',
    );
    await queryRunner.query('DROP INDEX history_account_date_idx ON history');
    await queryRunner.query('DROP TABLE history');
  }
}
