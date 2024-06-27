import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNameToAccounts1719431831878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE accounts
            ADD COLUMN name character varying NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE accounts
            DROP COLUMN name;
        `);
  }
}
