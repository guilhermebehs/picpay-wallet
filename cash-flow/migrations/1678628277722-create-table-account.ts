import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableAccount1678628277722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account',
        columns: [
          {
            name: 'id',
            type: 'varchar(10)',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar(50)',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal(10, 2)',
            isNullable: false,
          },
          {
            name: 'is_enabled',
            type: 'bool',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account');
  }
}
