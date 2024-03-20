import { Module } from '@nestjs/common';
import { ColumnsController } from './column.controller';
import { ColumnsService } from './column.service';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService]
})
export class ColumnModule {}
