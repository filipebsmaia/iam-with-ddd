import { BadRequestException } from '@core/common/exception/bad-request.expection';

export type ValidationErrorProperties = Array<Record<'property' | 'message', string>>;

export class ValidationError extends BadRequestException {
  constructor(public readonly properties: ValidationErrorProperties) {
    super(`Some values are malformed`, 'common/validation_error');
  }
}
