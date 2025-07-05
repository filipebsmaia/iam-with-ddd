import { AggregateRoot } from '@core/common/domain/aggregate-root';

export abstract class Repository<A extends AggregateRoot<any>> {
  abstract save(entity: A): Promise<void>;
}
