import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
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
}
