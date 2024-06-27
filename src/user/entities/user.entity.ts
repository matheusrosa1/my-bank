import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'username', nullable: false, unique: true })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;
}
