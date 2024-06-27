import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1719431831878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Inserir dados de usuários
    await queryRunner.query(`
      INSERT INTO users (username, password)
      VALUES
        ('João Silva', 'senha123'),
        ('Maria Souza', 'senha456');
    `);

    // Inserir dados de contas, relacionando com usuários
    await queryRunner.query(`
      INSERT INTO accounts (name, type, initial_balance)
      VALUES
        ('João Silva', 'corrente', 1000.00),
        ('Maria Souza', 'poupança', 500.00);
    `);

    // Inserir dados de pagamentos, relacionando com contas
    await queryRunner.query(`
      INSERT INTO payments (account_id, amount, date, description)
      SELECT
        a.id AS account_id,
        CASE
          WHEN u.username = 'João Silva' THEN 200.00
          WHEN u.username = 'Maria Souza' THEN 50.00
        END AS amount,
        CURRENT_TIMESTAMP AS date,
        CASE
          WHEN u.username = 'João Silva' THEN 'Pagamento de compra online'
          WHEN u.username = 'Maria Souza' THEN 'Pagamento de serviço mensal'
        END AS description
      FROM
        accounts a
      INNER JOIN users u ON a.name = u.username;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Excluir dados de pagamentos relacionados às contas dos usuários
    await queryRunner.query(`
      DELETE FROM payments
      WHERE account_id IN (SELECT id FROM accounts WHERE name IN ('João Silva', 'Maria Souza'));
    `);

    // Excluir dados de contas dos usuários
    await queryRunner.query(`
      DELETE FROM accounts
      WHERE name IN ('João Silva', 'Maria Souza');
    `);

    // Excluir dados dos usuários
    await queryRunner.query(`
      DELETE FROM users
      WHERE username IN ('João Silva', 'Maria Souza');
    `);
  }
}
