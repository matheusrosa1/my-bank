import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedsUsersAccountsPayments1719431831878
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO users (name, email, cpf, password)
            VALUES
              ('João Silva', 'joao.silva@example.com', '123.456.789-00', 'senha123'),
              ('Maria Souza', 'maria.souza@example.com', '987.654.321-00', 'senha456');
        `);

    await queryRunner.query(`
            INSERT INTO accounts (user_id, name, type, balance)
            VALUES
              ((SELECT id FROM users WHERE cpf = '123.456.789-00'), 'João Silva', 'corrente', 1000.00),
              ((SELECT id FROM users WHERE cpf = '987.654.321-00'), 'Maria Souza', 'poupança', 500.00);
        `);

    await queryRunner.query(`
            INSERT INTO payments (account_id, amount, date, description)
            VALUES
              ((SELECT id FROM accounts WHERE user_id = (SELECT id FROM users WHERE cpf = '123.456.789-00')), 200.00, CURRENT_TIMESTAMP, 'Pagamento de compra online'),
              ((SELECT id FROM accounts WHERE user_id = (SELECT id FROM users WHERE cpf = '987.654.321-00')), 50.00, CURRENT_TIMESTAMP, 'Pagamento de serviço mensal');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM payments
            WHERE account_id IN (SELECT id FROM accounts WHERE user_id IN (SELECT id FROM users WHERE cpf IN ('123.456.789-00', '987.654.321-00')));
        `);

    await queryRunner.query(`
            DELETE FROM accounts
            WHERE user_id IN (SELECT id FROM users WHERE cpf IN ('123.456.789-00', '987.654.321-00'));
        `);

    await queryRunner.query(`
            DELETE FROM users
            WHERE cpf IN ('123.456.789-00', '987.654.321-00');
        `);
  }
}
