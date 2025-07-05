import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { UnauthorizedError } from '@core/common/errors/unauthorized.error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ABAC_KEY } from './abac.decorator';

@Injectable()
export class ABACGuard implements CanActivate {
  constructor(private readonly signableAccessTokenProvider: SignableAccessTokenProvider) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredPermission = this.getRequiredPermission(context);

    if (!requiredPermission) {
      return true;
    }

    const authorization = request.cookies?.Authorization;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const { accountId } = await this.signableAccessTokenProvider.verify(authorization);

    const hasPermission = !!accountId; // TODO: Fetch permissions from account

    if (!hasPermission) {
      throw new PermissionDeniedError({
        requiredPermissions: requiredPermission,
      });
    }

    return true;
  }

  private getRequiredPermission(context: ExecutionContext): Array<string> {
    return Reflect.getMetadata(ABAC_KEY, context.getHandler());
  }
}
