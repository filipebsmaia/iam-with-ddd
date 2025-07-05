import { Exception } from '@core/common/exception/exception';
import { GrpcStatus, HttpStatus } from '@core/common/exception/expection-protocol-status';
export class InternalServerException extends Exception {
  constructor(message = 'An internal server error has occurred', code = 'common/internal_server_error') {
    super('InternalServer', message, code, {
      http: HttpStatus.INTERNAL_SERVER_ERROR,
      grpc: GrpcStatus.INTERNAL,
    });
  }
}
