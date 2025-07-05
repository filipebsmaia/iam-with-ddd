import { ForbiddenException } from '@core/common/exception/forbidden.expection';

export type PermissionDeniedErrorProperties = {
  requiredPermissions: string[];
};

export class PermissionDeniedError extends ForbiddenException {
  constructor(public readonly properties?: PermissionDeniedErrorProperties) {
    super(`You do not have permission to perform this action`, 'common/permission_denied');
  }
}
