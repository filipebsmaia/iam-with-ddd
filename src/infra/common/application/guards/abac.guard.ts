import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { PermissionDeniedError } from '@core/common/errors/permission-denied.error';
import { UnauthorizedError } from '@core/common/errors/unauthorized.error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ABAC_KEY } from './abac.decorator';
import { IAMProvider } from '@core/common/domain/providers/iam.provider';

@Injectable()
export class ABACGuard implements CanActivate {
  constructor(
    private readonly signableAccessTokenProvider: SignableAccessTokenProvider,
    private readonly iamProvider: IAMProvider,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredPermissions = this.getRequiredPermission(context);

    if (!requiredPermissions) {
      return true;
    }

    const authorization = request.cookies?.Authorization;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const { accountId } = await this.signableAccessTokenProvider.verify(authorization);

    // const hasPermission = !!accountId; // TODO: Fetch permissions from account
    const hasPermission = await this.iamProvider.hasPermissions({ accountId, permissions: requiredPermissions });
    if (!hasPermission) {
      throw new PermissionDeniedError({
        requiredPermissions: requiredPermissions,
      });
    }

    return true;
  }

  private getRequiredPermission(context: ExecutionContext): Array<string> {
    return Reflect.getMetadata(ABAC_KEY, context.getHandler());
  }
}
