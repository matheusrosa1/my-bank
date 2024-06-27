import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeederReportsTransactions1719522906355
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "transaction_reports" ("account_id", "startDate", "endDate", "totalAmount", "payments")
      VALUES
        (
          1, 
          '2024-01-01', 
          '2024-01-31', 
          1500.00,
          '[
            {"id": 1, "accountId": 1, "amount": 200, "description": "Payment to XYZ", "date": "2024-01-01"},
            {"id": 2, "accountId": 1, "amount": 1300, "description": "Payment to ABC", "date": "2024-01-15"}
          ]'
        ),
        (
          2, 
          '2024-02-01', 
          '2024-02-29', 
          2500.00,
          '[
            {"id": 3, "accountId": 2, "amount": 1000, "description": "Payment to DEF", "date": "2024-02-10"},
            {"id": 4, "accountId": 2, "amount": 1500, "description": "Payment to GHI", "date": "2024-02-20"}
          ]'
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "transaction_reports"`);
  }
}
