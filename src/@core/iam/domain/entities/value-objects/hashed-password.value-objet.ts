import { ValueObject } from '@core/common/domain/value-objects/value-object';

export class HashedPassword extends ValueObject<string> {
  constructor(hashedPassword: string) {
    super(hashedPassword);
  }
}

export default HashedPassword;
