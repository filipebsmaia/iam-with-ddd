import { UseCase } from './use-case';

export abstract class Query<T, R> extends UseCase<T, R> {}
