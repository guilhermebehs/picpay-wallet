import { HistoryDto } from 'src/dtos/history-dto';

export interface HistoryRepository {
  insert(data: HistoryDto): Promise<void>;
}
