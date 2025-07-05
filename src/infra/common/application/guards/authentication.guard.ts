import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { UnauthorizedError } from '@core/common/errors/unauthorized.error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IS_AUTHENTICATED_KEY, IsAuthenticatedDecoratorProps } from './is-autneticated.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly signableAccessTokenProvider: SignableAccessTokenProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authenticateProps = this.getAuthenticateProps(context);

    if (!authenticateProps) {
      return true;
    }

    const authorization = request.cookies?.Authorization;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const { ignoreExpiration } = authenticateProps;

    if (ignoreExpiration) {
      const { accountId } = await this.signableAccessTokenProvider.verify(authorization); // The verify only validate if token is valid, not check expiration
      request['user'] = { accountId };
    } else {
      const { accountId } = await this.signableAccessTokenProvider.decode(authorization);
      request['user'] = { accountId };
    }

    return true;
  }

  private getAuthenticateProps(context: ExecutionContext): IsAuthenticatedDecoratorProps | undefined | null {
    return Reflect.getMetadata(IS_AUTHENTICATED_KEY, context.getHandler());
  }
}
