import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserType {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
