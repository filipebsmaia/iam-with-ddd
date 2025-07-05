import { SetMetadata } from '@nestjs/common';

export const IS_AUTHENTICATED_KEY = 'IS_AUTHENTICATED';

export interface IsAuthenticatedDecoratorProps {
  ignoreExpiration?: boolean;
}

export const IsAuthenticated = (props: IsAuthenticatedDecoratorProps) => {
  return SetMetadata(IS_AUTHENTICATED_KEY, props);
};
