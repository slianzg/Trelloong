import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  // ExecutionContext : 현재 요청의 사용자 정보를 추출하는 역할
  (data: unknown, ctx: ExecutionContext) => {
    // http 요청 객체를 가져와서
    const request = ctx.switchToHttp().getRequest();
    // user 속성 반환. user가 존재하지 않는다면 null 반환
    return request.user ? request.user : null;
  },
);