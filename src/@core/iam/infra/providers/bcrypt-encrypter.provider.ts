import { Compare, EncrypterProvider } from '@core/iam/domain/providers/encrypter.provider';
import { compare, hash } from 'bcrypt';

export class BcryptEncrypterProvider extends EncrypterProvider {
  compare({ hash, plain }: Compare): Promise<boolean> {
    return compare(plain, hash);
  }
  async encrypt(value: string): Promise<string> {
    return await hash(value, 10);
  }
}
