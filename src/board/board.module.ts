import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Boards } from './entities/board.entity';
import { Members } from 'src/member/entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/utils/sendEmail.service';

@Module({
    imports: [
      JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET_KEY'),
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Boards, User, Members]),
    ],
    providers: [BoardService, SendEmailService],
    controllers: [BoardController],
    exports: [BoardService],
  })
export class BoardModule {}
