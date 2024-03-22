import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MemberService } from 'src/member/member.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    // private readonly memberSerivce: MemberService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const { authorization } = req.cookies;
    if (authorization) {
      const [tokenType, token] = authorization.split(' ');
      if (token) {
        return token;
      }
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    // userId를 불러올거면 member 안에 Role도 같이 불러오던가
    // 여기선 대충 필터링 해주고 가드에서 구분 하는 로직
    if (_.isNil(user)) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    // const boardMember = await this.memberSerivce.findxx(payload.userId)
    return user;
  }
}
