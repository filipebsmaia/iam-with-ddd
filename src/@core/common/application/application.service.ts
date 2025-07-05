import { EventManager } from '@core/common/domain/event/event-manager';
import { DomainEventContext } from '@core/common/domain/domain-event-context';

export class ApplicationService {
  async start() {
    //
  }

  async finish() {
    const aggregateRoots = DomainEventContext.getAggregates();

    for (const aggregateRoot of aggregateRoots) {
      await EventManager.dispatchDomainEventsForAggregate(aggregateRoot);
    }

    aggregateRoots.forEach((aggregateRoot) => aggregateRoot.clearEvents());
  }

  async fail() {
    //
  }

  async run<T>(clazz: ClassInstance, callback: () => Promise<T>): Promise<T> {
    return DomainEventContext.run(async () => {
      await this.start();

      // const start = process.hrtime();

      // meters.useCaseExecutionsTotalMeter.add(1, {
      //   service: serviceName,
      //   use_case: clazz.constructor.name,
      //   status: "STARTED",
      // });
      // meters.useCaseConcurrentMeter.add(1, {
      //   service: serviceName,
      //   use_case: clazz.constructor.name,
      // });

      try {
        const result = await callback();
        // meters.useCaseExecutionsTotalMeter.add(1, {
        //   service: serviceName,
        //   use_case: clazz.constructor.name,
        //   status: "SUCCESS",
        // });
        await this.finish();
        return result;
      } catch (e) {
        // meters.useCaseExecutionsTotalMeter.add(1, {
        //   service: serviceName,
        //   use_case: clazz.constructor.name,
        //   status: "FAILED",
        // });
        // meters.useCaseErrorsTotalMeter.add(1, {
        //   service: serviceName,
        //   use_case: clazz.constructor.name,
        //   error:
        //     e instanceof Exception
        //       ? e.code
        //       : (e?.constructor?.name ?? "UnknownError"),
        // });
        await this.fail();
        throw e;
      } finally {
        // const duration = this.getDurationInSeconds(start);
        // meters.useCaseDurationMeter.record(duration, {
        //   service: serviceName,
        //   use_case: clazz.constructor.name,
        // });
        // meters.useCaseConcurrentMeter.add(-1, {
        //   service: serviceName,
        //   use_case: clazz.constructor.name,
        // });
      }
    });
  }

  wrap<T extends ClassInstance>(service: T): T {
    return new Proxy(service, {
      get: (target, prop, receiver) => {
        const original = Reflect.get(target, prop, receiver);
        if (typeof original !== 'function') {
          return original;
        }

        return (...args: any[]) => this.run(target, () => original.apply(target, args));
      },
    });
  }

  private getDurationInSeconds(start: [number, number]): number {
    const diff = process.hrtime(start);
    return diff[0] + diff[1] / 1e9;
  }
}
