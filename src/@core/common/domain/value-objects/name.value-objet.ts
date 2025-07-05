import { ValueObject } from '@core/common/domain/value-objects/value-object';
import { InvalidNameError } from '@core/common/errors/invalid-name.error';

export class Name extends ValueObject<string> {
  constructor(id: string) {
    super(id);
    this.validate();
  }

  private validate() {
    const parts = this.value
      .trim()
      .split(' ')
      .map((part) => part.trim());
    if (parts.length < 2) {
      throw new InvalidNameError(this.value);
    }

    const hasPartsWithLengthLowerThanThree = parts.some((part) => part.length < 3);

    if (hasPartsWithLengthLowerThanThree) {
      throw new InvalidNameError(this.value);
    }
  }
}

export default Name;
