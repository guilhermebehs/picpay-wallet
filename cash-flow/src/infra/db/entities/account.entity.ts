import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column({ name: 'is_enabled' })
  isEnabled: boolean;
}
