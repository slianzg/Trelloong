import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Member } from 'src/member/entities/member.entity';

export const GroupInfo = createParamDecorator(
  (data, ctx: ExecutionContext): Member => {
    const request = ctx.switchToHttp().getRequest();
    return request.member ? request.member : null;
  },
);
