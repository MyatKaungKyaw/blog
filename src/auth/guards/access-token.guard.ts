import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/public/public.decorator';
import { IS_REFRESH_TOKEN_KEY } from '../decorators/refresh-token.decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isRefreshToken = this.reflector.getAllAndOverride(
      IS_REFRESH_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || isRefreshToken) return true;

    return super.canActivate(context);
  }
}
