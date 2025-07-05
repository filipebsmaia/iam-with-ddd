import { DomainEvent } from '@core/common/domain/event/domain-event';
import { EventManager } from '@core/common/domain/event/event-manager';

export abstract class DomainEventHandler<T extends DomainEvent> {
  constructor() {
    this.listenTo().forEach((event) => {
      EventManager.register(event, async (event: T) => {
        try {
          console.log(`Processing ${event.constructor.name} on ${this.constructor.name}`, { event });
          await this.handle(event);
          console.log(`${event.constructor.name} was processed on ${this.constructor.name}`, { event });
        } catch (error) {
          console.error(`Failed to process ${event.constructor.name} on ${this.constructor.name}`, { event, error });
          throw error;
        }
      });
    });
  }

  abstract handle(event: T): Promise<void>;
  abstract listenTo(): Array<string>;
}
