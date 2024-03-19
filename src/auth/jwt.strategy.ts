import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly memberService: MemberService,
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
    const member = await this.memberService.findByEmail(payload.email);
    if (_.isNil(member)) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    return member;
  }
}
