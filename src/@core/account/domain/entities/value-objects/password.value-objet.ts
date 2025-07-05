import { ValueObject } from '@core/common/domain/value-objects/value-object';
import { WeakPasswordError } from '@core/iam/domain/errors/week-password-error.error';

export class Password extends ValueObject<string> {
  constructor(password: string) {
    super(password);
    this.validate();
  }

  private validate() {
    const isShort = this.value.length < 8;
    const hasLetter = /[A-Za-z]/.test(this.value);
    const hasNumber = /\d/.test(this.value);
    const hasSymbol = /[^A-Za-z0-9]/.test(this.value);

    if (isShort || !hasLetter || !hasNumber || !hasSymbol) {
      throw new WeakPasswordError();
    }
  }
}

export default Password;
