import { AccountEntity } from 'src/account/entities/account.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'cpf', unique: true, nullable: false })
  cpf: string;

  @OneToOne(() => AccountEntity, (account) => account.user, { cascade: true })
  account: AccountEntity;
}
