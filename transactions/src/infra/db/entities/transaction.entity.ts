import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  account: string;

  @Column()
  amount: number;

  @Column()
  status: TransactionStatus;

  @Column({ default: 'now()' })
  date?: Date;
}
