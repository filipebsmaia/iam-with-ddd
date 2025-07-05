import { MessagingEvent, MessagingProvider, SendEvent } from '@core/common/domain/messaging-provider';

import { Producer, Message } from 'kafkajs';
import { IntegrationEvent } from '../domain/event/integration-event';

export class KafkaMessagingProvider implements MessagingProvider {
  constructor(private readonly kafkaProducer: Producer) {}

  async produce<Value extends MessagingEvent>({ subject, key, headers, events }: SendEvent<Value>): Promise<void> {
    const messages: Array<Message> = [];
    if (Array.isArray(events)) {
      events.forEach((event: IntegrationEvent) => {
        messages.push({
          key,
          value: JSON.stringify(event.payload),
          headers: {
            'x-occurred-on': event.occurredOn.toISOString(),
            'x-source-event-name': event.eventName,
            ...headers,
          },
        });
      });
    } else {
      messages.push({
        key,
        value: JSON.stringify(events.payload),
        headers: {
          'x-occurred-on': events.occurredOn.toISOString(),
          'x-source-event-name': events.eventName,
          ...headers,
        },
      });
    }

    await this.kafkaProducer.send({
      topic: subject,
      messages,
    });
  }
}
