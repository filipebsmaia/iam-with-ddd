import { Logger } from '@core/common/application/logger';
import { ValidationError } from '@core/common/errors/validation.error';
import { Exception } from '@core/common/exception/exception';
import { InternalServerException } from '@core/common/exception/internal-server.expection';

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  private logger = new Logger();
  catch(exception: HttpException | Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception.stack ?? `An error ocurred: ${exception.name}(${exception.message})`, exception);

    if (exception instanceof HttpException) {
      const {} = response;
      return response.status(exception.getStatus()).json({
        type: exception.name,
        // code: exception.getResponse(),
        code: `common/${(exception.getResponse() as any).error.toLowerCase().replace(/ /g, '_')}`,
        message: exception.message,
      });
    }

    const exceptionInstance = exception instanceof Exception ? exception : new InternalServerException();

    const { protocolDict, code, message, name } = exceptionInstance;

    return response.status(protocolDict['http']).json({
      type: name,
      code,
      message,
      properties: exceptionInstance instanceof ValidationError ? exceptionInstance.properties : undefined,
    });
  }
}
