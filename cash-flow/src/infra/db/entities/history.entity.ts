import { HistoryType } from 'src/enums/history-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'history' })
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  account: string;

  @Column({ name: 'old-amount' })
  oldAmount: number;

  @Column({ name: 'new-amount' })
  newAmount: number;

  @Column()
  type: HistoryType;

  @Column({ default: 'now()' })
  date?: Date;
}
