import { Module } from '@nestjs/common';
import { JWTSignableAccessTokenProvider } from '@core/common/infra/providers/jwt-signable-access-token.provider';
import { JWTSignableRefreshTokenProvider } from '@core/common/infra/providers/jwt-signable-refresh-token.provider';
import { SignableAccessTokenProvider } from '@core/common/domain/providers/signable-access-token.provider';
import { SignableRefreshTokenProvider } from '@core/common/domain/providers/signable-refresh-token.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: SignableAccessTokenProvider,
      useFactory: () => {
        return new JWTSignableAccessTokenProvider();
      },
      inject: [],
    },
    {
      provide: SignableRefreshTokenProvider,
      useFactory: () => {
        return new JWTSignableRefreshTokenProvider();
      },
      inject: [],
    },
  ],
  exports: [SignableAccessTokenProvider, SignableRefreshTokenProvider],
})
export class SignableTokenModule {}
