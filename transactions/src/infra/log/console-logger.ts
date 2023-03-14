import { Injectable } from '@nestjs/common';
import { Logger } from 'src/contracts';

@Injectable()
export class ConsoleLogger implements Logger {
  print(endpoint: string, params: string) {
    console.log(
      `[${new Date().toISOString()}] Request received at '${endpoint}' with params '${params}'`,
    );
  }
  error(endpoint: string, error: any) {
    console.error(
      `[${new Date().toISOString()}] Error ocurred at '${endpoint}' with error '${error}'`,
    );
  }
}
