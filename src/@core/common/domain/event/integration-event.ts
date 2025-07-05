type Payload = string | number | Date | { [key: string]: Payload } | Array<Payload> | null | undefined;

export interface IntegrationEventProps<T extends Payload = Payload> {
  eventName: string;
  topic?: string;
  payload: T;
  key?: string;
}

export abstract class IntegrationEvent<T extends Payload = Payload> {
  public readonly eventName: string;
  public readonly topic?: string;
  public readonly payload: T;
  public readonly occurredOn: Date;
  public readonly key?: string;

  constructor({ eventName, payload, key, topic }: IntegrationEventProps<T>) {
    this.eventName = eventName;
    this.topic = topic;
    this.payload = payload;
    this.occurredOn = new Date();
    this.key = key;
  }

  public abstract shouldPublish(): boolean;
}
