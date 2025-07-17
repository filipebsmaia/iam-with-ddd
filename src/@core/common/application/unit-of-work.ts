import { AggregateRoot } from '../domain/aggregate-root';
import { DomainEventContext } from '../domain/domain-event-context';

export interface RunTransactionProps {
  isolation?: 'required' | 'none';
}
export abstract class UnitOfWork {
  abstract runTransaction<T>(_: RunTransactionProps, callback: () => Promise<T>): Promise<T>;

  getAggregateRoots = (): Set<AggregateRoot<any>> => {
    return DomainEventContext.getAggregates();
  };
}
