import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Columns } from './entities/column.entity';
import { UpdateColumnOrderDto } from './dto/updatecolumnorder-column.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('column')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  
  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    await this.columnsService.create(createColumnDto.boardId, createColumnDto.columnName, createColumnDto.columnOrder);
    return { message: '생성되엇습니다' };
  }

  @Get()
  async findAll() :Promise <Columns[]>{
   return await this.columnsService.findAll();
  }

  @Get(':boardId/:columnId')
  async findOne (@Param('boardId') boardId: number,
   @Param('columnId') columnId:number) {
   return await this.columnsService.findOne(+boardId, +columnId);
  }

  @Patch(':boardId/:columnId')
  async update (@Param('boardId') boardId: number,
          @Param('columnId') columnId:number, @Body() updateColumnDto: UpdateColumnDto) {
     await this.columnsService.update(+boardId, +columnId, updateColumnDto.columnName);
     return { message: '수정되엇습니다' };
  }

  @Patch(':boardId/:columnId/order')
  async updateColumnOrder(
    @Param('columnId') columnId: number,
    @Body() updateColumnOrderDto: UpdateColumnOrderDto
  ) {
    await this.columnsService.updateColumnOrder(columnId, updateColumnOrderDto.columnOrder);
    return { message: '컬럼 순서가 수정되었습니다.' };
  }

  @Delete(':boardId/:columnId')
  async remove(@Param('boardId') boardId: number,
               @Param('columnId') columnId:number) {
    await this.columnsService.remove(+boardId, +columnId);
    return { message: '삭제 되었습니다' };
  }
}