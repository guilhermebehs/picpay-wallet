import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableAccount1678909316093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE account 
         ADD COLUMN version integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE account 
         DROP COLUMN version integer`);
  }
}
