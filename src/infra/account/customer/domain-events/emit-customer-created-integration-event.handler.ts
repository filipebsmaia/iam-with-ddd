import { DomainEventHandler } from '@core/common/application/domain-event-handler';

export class EmitCustomerCreatedIntegrationEventHandler extends DomainEventHandler<any> {
  async handle(_event: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  listenTo(): Array<string> {
    throw new Error('Method not implemented.');
  }
}
