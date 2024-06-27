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

  @Column({
    name: 'amount',
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'date', type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @ManyToOne(() => AccountEntity, (account) => account.payments)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity; // Cada pagamento pertence a uma conta
}
