import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Columns } from './entities/column.entity';
import { UpdateColumnOrderDto } from './dto/updatecolumnorder-column.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller(':boardId/column')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  
  @Post('create')
  async create(@Param('boardId') boardId: number, @Body() createColumnDto: CreateColumnDto) {
    const newColumn = await this.columnsService.create(createColumnDto, boardId);
    return {
      message: '생성 되었습니다',
      data: newColumn, 
    };
  }

  @Get('list')
  async findAll(@Param('boardId') boardId: number): Promise<Columns[]> {
    return await this.columnsService.findAll(boardId);
  }

  @Get('info/:columnId')
  async findOne(@Param('boardId') boardId: number, @Param('columnId') columnId: number): Promise<Columns> {
    return await this.columnsService.findOne(boardId, columnId);
  }

//1
  @Patch('update/:columnId')
  async update (@Param('boardId') boardId: number,
          @Param('columnId') columnId:number, @Body() updateColumnDto: UpdateColumnDto) {
     await this.columnsService.update(+boardId, +columnId, updateColumnDto.columnName);
     return { message: '수정되엇습니다' };
  }

  @Patch('move/:columnId')
  async updateColumnOrder(
    @Param('columnId') columnId: number,
    @Param('boardId') boardId: number,
    @Body() updateColumnOrderDto: UpdateColumnOrderDto
  ) {
    await this.columnsService.updateColumnOrder(columnId, boardId, updateColumnOrderDto.columnOrder);
    return { message: '컬럼 순서가 수정되었습니다.' };
    
  }

  @Delete('delete/:columnId')
  async remove(@Param('boardId') boardId: number,
               @Param('columnId') columnId:number) {
    await this.columnsService.remove(+boardId, +columnId);
    return { message: '삭제 되었습니다' };
  }
}