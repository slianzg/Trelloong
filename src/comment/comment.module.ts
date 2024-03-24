import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { MemberModule } from 'src/member/member.module';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), MemberModule, CardModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
