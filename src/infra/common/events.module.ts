import { Module } from '@nestjs/common';
import { PublishIntegrationEventMessageEventHandler } from '@core/common/application/handlers/integration-events/publish-integration-event-message.handler';
import { MessagingProvider } from '@core/common/domain/messaging-provider';

// MessagingModule
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: PublishIntegrationEventMessageEventHandler,
      useFactory: (messagingProvider: MessagingProvider) => {
        return new PublishIntegrationEventMessageEventHandler(messagingProvider);
      },
      inject: [MessagingProvider],
    },
  ],
})
export class EventsModule {}
