import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { BoardModule } from "src/board/board.module";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
      // passport를 쓸 거고 기본적으론 jwt를 쓸 거다.   session : false == stateless
      PassportModule.register({ defaultStrategy: 'jwt', session: false }),
      JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET_KEY'),
        }),
        inject: [ConfigService],
      }),
      BoardModule // 추가!
    ],
    providers: [JwtStrategy],
  })
  export class AuthModule {}