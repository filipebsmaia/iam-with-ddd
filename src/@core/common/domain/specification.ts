import { AggregateRoot } from '@core/common/domain/aggregate-root';

export abstract class Specification<A extends AggregateRoot<any>> {
  abstract isSatisfiedBy(entity: A): Promise<boolean>;

  and(other: Specification<A>): Specification<A> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<A>): Specification<A> {
    return new OrSpecification(this, other);
  }

  not(): Specification<A> {
    return new NotSpecification(this);
  }
}

export class AndSpecification<A extends AggregateRoot<any>> extends Specification<A> {
  constructor(
    private readonly left: Specification<A>,
    private readonly right: Specification<A>,
  ) {
    super();
  }

  async isSatisfiedBy(candidate: A): Promise<boolean> {
    return (await this.left.isSatisfiedBy(candidate)) && (await this.right.isSatisfiedBy(candidate));
  }
}

export class OrSpecification<A extends AggregateRoot<any>> extends Specification<A> {
  constructor(
    private readonly left: Specification<A>,
    private readonly right: Specification<A>,
  ) {
    super();
  }

  async isSatisfiedBy(candidate: A): Promise<boolean> {
    return (await this.left.isSatisfiedBy(candidate)) || (await this.right.isSatisfiedBy(candidate));
  }
}

export class NotSpecification<A extends AggregateRoot<any>> extends Specification<A> {
  constructor(private readonly spec: Specification<A>) {
    super();
  }

  async isSatisfiedBy(candidate: A): Promise<boolean> {
    return !(await this.spec.isSatisfiedBy(candidate));
  }
}
