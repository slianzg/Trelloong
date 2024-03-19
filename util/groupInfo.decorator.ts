import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Group } from 'src/group/entities/group.entity';

export const GroupInfo = createParamDecorator(
  (data, ctx: ExecutionContext): Group => {
    const request = ctx.switchToHttp().getRequest();
    return request.group ? request.group : null;
  },
);
