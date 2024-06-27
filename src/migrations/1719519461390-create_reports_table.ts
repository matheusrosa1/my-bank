import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportsTableYYYYMMDDHHMMSS implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" SERIAL NOT NULL,
        "startDate" DATE NOT NULL,
        "endDate" DATE NOT NULL,
        "totalAmount" NUMERIC NOT NULL,
        CONSTRAINT "PK_reports" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reports"`);
  }
}
