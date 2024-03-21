import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { BoardModule } from "src/board/board.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UserModule,BoardModule
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}