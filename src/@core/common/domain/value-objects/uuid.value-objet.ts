import { validate as uuidValidate } from 'uuid';
import crypto from 'crypto';
import { ValueObject } from '@core/common/domain/value-objects/value-object';
import { InvalidUuidError } from '@core/common/errors/invalid-uuid.error';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || crypto.randomUUID());
    this.validate();
  }

  public static from(value: string) {
    return new Uuid(value);
  }

  private validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUuidError(this.value);
    }
  }
}

export default Uuid;
