import { AccountEntity } from 'src/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'account_id', nullable: false })
  accountId: number;

  @Column('numeric', {
    name: 'amount',
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => AccountEntity, (account) => account.payments)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity; // Cada pagamento pertence a uma conta
}
