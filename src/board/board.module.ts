import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { Member } from 'src/member/entities/member.entity';
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
      TypeOrmModule.forFeature([Board, User, Member]),
    ],
    providers: [BoardService, SendEmailService],
    controllers: [BoardController],
    exports: [BoardService],
  })
export class BoardModule {}
