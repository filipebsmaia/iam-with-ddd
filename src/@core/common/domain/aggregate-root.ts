import { DomainEventContext } from './domain-event-context';
import { DomainEvent } from '@core/common/domain/event/domain-event';
import Uuid from './value-objects/uuid.value-objet';

type PropsWithId<T> = T & { id: NonNullable<Uuid> };
export abstract class AggregateRoot<Props> {
  events: Set<DomainEvent> = new Set<DomainEvent>();

  protected props: PropsWithId<Props>;

  constructor(props: PropsWithId<Props>) {
    this.props = props;
    DomainEventContext.registerAggregate(this);
  }

  get id() {
    return this.props.id;
  }

  equals(obj: this) {
    if (obj === null || obj === undefined) {
      return false;
    }

    if (obj.id === undefined) {
      return false;
    }

    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }

    return obj.id.equals(this.id);
  }

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  clearEvents() {
    this.events.clear();
  }

  abstract toJSON(): any;
}
