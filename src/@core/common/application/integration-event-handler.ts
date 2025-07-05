import { EventManager } from '@core/common/domain/event/event-manager';
import { IntegrationEvent } from '@core/common/domain/event/integration-event';
import { Logger } from './logger';

export abstract class IntegrationEventHandler<T extends IntegrationEvent> {
  protected logger = new Logger();

  constructor() {
    this.listenTo().forEach((event) => {
      EventManager.registerToIntegrationEvent(event, async (event: T) => {
        try {
          this.logger.debug(`Processing ${event.constructor.name} on ${this.constructor.name}`, { event });
          await this.handle(event);
          this.logger.debug(`${event.constructor.name} was processed on ${this.constructor.name}`, { event });
        } catch (error) {
          this.logger.error(`Failed to process ${event.constructor.name} on ${this.constructor.name}`, { event, error });
          throw error;
        }
      });
    });
  }

  abstract handle(event: T): Promise<void>;
  abstract listenTo(): Array<string>;
}
