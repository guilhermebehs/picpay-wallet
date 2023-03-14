import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableTransaction1678814984624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'account',
            type: 'varchar(10)',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal(10, 2)',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar(20)',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        name: 'transaction_account_fk',
        columnNames: ['account'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transaction', 'transaction_account_fk');
    await queryRunner.dropTable('transaction');
  }
}
