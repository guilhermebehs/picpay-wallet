import { HistoryType } from 'src/enums/history-type.enum';

export class TransactionReceivedDto {
  account: string;
  amount: number;
  type: HistoryType;
  ocurredOn: Date;
}
