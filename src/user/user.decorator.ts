import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/role/enums/role.enum';

export interface UserType {
  name: string;
  sub: string;
  iat: number;
  exp: number;
  role: Role;
}

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
