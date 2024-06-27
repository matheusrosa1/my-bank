import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1719365581654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
      "id" SERIAL NOT NULL,
      "username" character varying NOT NULL,
      "email" character varying NOT NULL,
      "cpf" character varying NOT NULL,
      "password" character varying NOT NULL,
      CONSTRAINT "PK_users" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_users_email" UNIQUE ("email"),
      CONSTRAINT "UQ_users_cpf" UNIQUE ("cpf")
    )`);

    await queryRunner.query(`CREATE TABLE "accounts" (
      "id" SERIAL NOT NULL,
      "name" character varying NOT NULL,
      "type" character varying NOT NULL,
      "balance" integer NOT NULL,
      CONSTRAINT "PK_accounts" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`CREATE TABLE "payments" (
      "id" SERIAL NOT NULL,
      "account_id" integer NOT NULL,
      "amount" numeric NOT NULL,
      "date" DATE NOT NULL DEFAULT CURRENT_DATE,
      "description" character varying,
      CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
      CONSTRAINT "FK_payments_accounts" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
