import { SetMetadata } from '@nestjs/common';

export const ABAC_KEY = 'ATTRIBUTE_BASED_ACCESS_CONTROL';

// TODO: Add method to skip permission based on attribute
export const ABAC = (permissions: Array<string>) => {
  return SetMetadata(ABAC_KEY, permissions);
};
