import { Exception } from '@core/common/exception/exception';
import { GrpcStatus, HttpStatus } from '@core/common/exception/expection-protocol-status';

export abstract class ForbiddenException extends Exception {
  constructor(message: string, code: string) {
    super('Forbidden', message, code, {
      http: HttpStatus.FORBIDDEN,
      grpc: GrpcStatus.PERMISSION_DENIED,
    });
  }
}
