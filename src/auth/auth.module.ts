import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { BoardModule } from "src/board/board.module";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'jwt', session: false }),
      JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET_KEY'),
        }),
        inject: [ConfigService],
      }),
      BoardModule
    ],
    providers: [JwtStrategy],
  })
  export class AuthModule {}