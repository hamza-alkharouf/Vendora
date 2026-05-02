import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUser } from '../interfaces/active-user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: ActiveUser }>();
    return request.user;
  },
);
