import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1719365581655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" ("username", "email", "cpf", "password")
      VALUES
        ('Alice Johnson', 'alice@example.com', '530.832.640-11', 'hashed_password1'),
        ('Bob Smith', 'bob@example.com', '030.664.730-31', 'hashed_password2')
    `);

    await queryRunner.query(`
      INSERT INTO "accounts" ("name", "type", "balance")
      VALUES
        ('Alice Johnson', 'checking', 1500.00),
        ('Bob Smith', 'savings', 2500.00)
    `);

    await queryRunner.query(`
      INSERT INTO "payments" ("account_id", "amount", "date", "description")
      VALUES
        (1, 200.00, '2024-01-01', 'Payment to XYZ'),
        (2, 300.00, '2024-01-02', 'Payment to ABC')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "payments"`);
    await queryRunner.query(`DELETE FROM "accounts"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
