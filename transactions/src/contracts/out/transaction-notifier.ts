import { TransactionReceivedDto } from 'src/dtos';

export interface TransactionNotifier {
  invoke(transactionReceivedDto: TransactionReceivedDto): Promise<void>;
}
