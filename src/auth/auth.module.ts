import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UserModule,
    MemberModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
