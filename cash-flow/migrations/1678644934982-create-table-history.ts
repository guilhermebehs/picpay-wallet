import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class createTableHistory1678644934982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'history',
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
            name: 'old-amount',
            type: 'decimal(10, 2)',
            isNullable: false,
          },
          {
            name: 'new-amount',
            type: 'decimal(10, 2)',
            isNullable: false,
          },
          {
            name: 'type',
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
      'history',
      new TableForeignKey({
        name: 'history_account_fk',
        columnNames: ['account'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createIndex(
      'history',
      new TableIndex({
        name: 'history_account_date_idx',
        columnNames: ['account', 'date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('history', 'history_account_date_idx');
    await queryRunner.dropForeignKey('history', 'history_account_fk');
    await queryRunner.dropTable('history');
  }
}
