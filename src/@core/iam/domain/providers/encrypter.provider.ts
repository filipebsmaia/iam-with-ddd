export interface Compare {
  plain: string;
  hash: string;
}

export abstract class EncrypterProvider {
  abstract compare(payload: Compare): Promise<boolean>;
  abstract encrypt(payload: string): Promise<string>;
  //
}
