import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { Member } from 'src/member/entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/utils/sendEmail.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([Board, User, Member]),
    ],
    providers: [BoardService, SendEmailService],
    controllers: [BoardController],
    exports: [BoardService],
  })
export class BoardModule {}
