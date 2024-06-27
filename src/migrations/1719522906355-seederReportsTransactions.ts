import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeederReportsTransactions1719522906355
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "transaction_reports" ("account_id", "startDate", "endDate", "totalAmount")
          VALUES
            (1, '2024-01-01', '2024-01-31', 1500.00),
            (2, '2024-02-01', '2024-02-29', 2500.00)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "transaction_reports"`);
  }
}
