export interface Logger {
  print(endpoint: string, params: string);
  error(endpoint: string, error: string);
}
