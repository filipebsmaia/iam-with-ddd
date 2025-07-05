import { ValueObject } from '@core/common/domain/value-objects/value-object';
import { InvalidEmailError } from '@core/common/errors/invalid-email.error';

export class Email extends ValueObject<string> {
  constructor(email: string) {
    super(email);
    this.validate();
  }

  private validate() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(this.value)) {
      throw new InvalidEmailError(this.value);
    }
  }
}

export default Email;
