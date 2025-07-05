import { AggregateRoot } from '@core/common/domain/aggregate-root';
import { EventEmitter2 } from 'eventemitter2';
import { DomainEvent } from './domain-event';
import { IntegrationEvent } from './integration-event';

export class EventManager {
  private static domainEventsSubscriber = new EventEmitter2({
    wildcard: true,
  });

  private static integrationEventsSubscriber = new EventEmitter2({
    wildcard: true,
  });

  public static register(event: string, handler: (...values: any[]) => void) {
    this.domainEventsSubscriber.addListener(event, handler);
  }

  public static registerToIntegrationEvent(event: string, handler: (...values: any[]) => void) {
    this.integrationEventsSubscriber.addListener(event, handler);
  }

  private static isPromiseLike<T = any>(value: unknown): value is Promise<T> {
    return typeof value === 'object' && value !== null && typeof (value as any).then === 'function';
  }

  // TODO: Maybe create system to priority of event consumptions
  public static async callDomainEvent(event: DomainEvent) {
    const listeners = this.domainEventsSubscriber.listeners(event.constructor.name);
    for (const listener of listeners) {
      const result = listener(event);

      if (this.isPromiseLike(result)) {
        await Promise.all([result]);
        continue;
      }
    }
  }

  public static async dispatchDomainEventsForAggregate(aggregate: AggregateRoot<any>) {
    for (const event of aggregate.events) {
      await this.callDomainEvent(event);
    }
    aggregate.clearEvents();
  }

  public static async dispatchIntegrationEvent(event: IntegrationEvent | Array<IntegrationEvent>) {
    try {
      if (Array.isArray(event)) {
        await Promise.all(event.map((ev) => this.integrationEventsSubscriber.emitAsync(ev.constructor.name, ev)));
      } else {
        await this.integrationEventsSubscriber.emitAsync(event.constructor.name, event);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
