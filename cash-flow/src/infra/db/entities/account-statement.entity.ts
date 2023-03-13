import { HistoryType } from 'src/enums/history-type.enum';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT  ABS(h.new-amount - h.old-amount) as value,   h.new-amount as final_amount, h.date as date,
  h.type as type  FROM history h
  `,
})
export class AccountStatementEntity {
  @ViewColumn({ name: 'final_amount' })
  finalAmount: number;
  @ViewColumn()
  value: number;

  @ViewColumn()
  date: Date;

  @ViewColumn()
  type: HistoryType;;
}
