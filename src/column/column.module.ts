import { Module } from '@nestjs/common';
import { ColumnsController } from './column.controller';
import { ColumnsService } from './column.service';
import { Columns } from './entities/column.entity';
import { Board } from 'src/board/entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from 'src/board/board.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Columns]),
  ],
  providers: [ColumnsService],
  controllers: [ColumnsController],
  exports: [ColumnsService],
})
export class ColumnModule {}
