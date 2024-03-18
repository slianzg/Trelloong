import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { BoardModule } from './board/board.module';
import { MemberModule } from './member/member.module';
import { ColumnsModule } from './columns/columns.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [BoardModule, MemberModule, ColumnsModule, GroupModule],
  controllers: [AppController, BoardController],
  providers: [AppService, BoardService],
})
export class AppModule {}
