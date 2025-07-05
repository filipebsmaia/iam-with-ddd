import { IntegrationEventHandler } from '@core/common/application/integration-event-handler';
import { IntegrationEvent } from '@core/common/domain/event/integration-event';
import { MessagingProvider } from '@core/common/domain/messaging-provider';

export class PublishIntegrationEventMessageEventHandler extends IntegrationEventHandler<IntegrationEvent<any>> {
  constructor(private readonly messagingProvider: MessagingProvider) {
    super();
  }

  async handle({ eventName, topic, occurredOn, payload, key, shouldPublish }: IntegrationEvent<any>): Promise<void> {
    if (!shouldPublish() || !topic) {
      return;
    }
    this.logger.info('Publishing IntegrationEvent message', {
      eventName,
      topic,
      occurredOn,
      payload,
      key,
    });
    await this.messagingProvider.produce({
      subject: topic,
      events: { eventName, topic, occurredOn, payload },
      key,
    });
  }

  listenTo(): string[] {
    return ['*'];
  }
}
