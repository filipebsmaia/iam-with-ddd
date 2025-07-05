import { IntegrationEvent } from './event/integration-event';

export type MessagingEvent = PropertiesOnly<IntegrationEvent>;
export interface SendEvent<Value extends MessagingEvent | Array<Event>> {
  subject: string;
  events: Value;
  key?: string;
  headers?: Record<string, string>;
}

export interface SubscribeEvent<Value extends MessagingEvent> {
  topic: string;
  handler: (_: { key: string; event: Value; headers: Record<string, string> }) => Promise<void>;
}

export abstract class MessagingProvider {
  abstract produce<Value extends MessagingEvent = MessagingEvent>(payload: SendEvent<Value>): Promise<void>;
}
