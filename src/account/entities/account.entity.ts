import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column('numeric', { name: 'balance', scale: 2, nullable: false })
  balance: number;

  @Column({ type: 'enum', enum: ['current', 'savings'], nullable: false })
  type: string;

  @OneToMany(() => PaymentEntity, (payment) => payment.account)
  payments: PaymentEntity[]; // Uma conta pode ter vários pagamentos
}
