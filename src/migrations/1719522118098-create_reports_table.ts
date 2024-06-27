import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportsTable1719522118098 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "transaction_reports" (
            "id" SERIAL NOT NULL,
            "account_id" integer NOT NULL,
            "startDate" DATE NOT NULL,
            "endDate" DATE NOT NULL,
            "totalAmount" NUMERIC NOT NULL,
            CONSTRAINT "PK_reports" PRIMARY KEY ("id"),
            CONSTRAINT "FK_reports_accounts" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction_reports"`);
  }
}
