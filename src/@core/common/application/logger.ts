import pino from 'pino';

export class Logger {
  private pino = pino();

  constructor() {}

  public debug<T extends object>(msg: string, data: T): void {
    this.pino.debug({
      data,
      msg,
    });
  }

  public info<T extends object>(msg: string, data: T): void {
    this.pino.info({
      data,
      msg,
    });
  }

  public warn<T extends object>(msg: string, data: T): void {
    this.pino.warn({
      data,
      msg,
    });
  }

  public error<T extends object>(msg: string, data: T): void {
    this.pino.error({
      data,
      msg,
    });
  }
}
