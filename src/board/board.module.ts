import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Boards } from './entities/board.entity';

@Module({
    imports: [
      JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET_KEY'),
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Boards]),
    ],
    providers: [BoardService],
    controllers: [BoardController],
    exports: [BoardService],
  })
export class BoardModule {}
