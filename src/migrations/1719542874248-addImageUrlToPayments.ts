import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageUrlToPayments1719542874248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "payments"
          ADD COLUMN "image_url" VARCHAR
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "payments"
          DROP COLUMN "image_url"
        `);
  }
}
