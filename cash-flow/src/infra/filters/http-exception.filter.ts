import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';
import { ConsoleLogger } from '../log/console-logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let errorBody;
    if (status >= 400 && status <= 499)
      errorBody = {
        statusCode: status,
        message: exception.getResponse()['message'],
      };
    else errorBody = { statusCode: status, message: 'Internal Error' };

    new ConsoleLogger().error(request.url, JSON.stringify(errorBody));
    response.status(status).json(errorBody);
  }
}
