import { Logger } from '../application/logger';

export abstract class UseCase<T, R> {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  abstract execute(entity: T): Promise<R>;
}
