import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Columns } from './entities/column.entity';

@Controller('column')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    return await this.columnsService.create(createColumnDto.boardId, createColumnDto.columName, createColumnDto.columnOrder);
  }

  @Get()
  async findAll() :Promise <Columns[]>{
   return await this.columnsService.findAll();
  }

  @Get(':boardId/:columnId')
  async findOne
  (@Param('boardId') boardId: number,
   @Param('columnId') columnId:number) {
   return this.columnsService.findOne(+boardId, +columnId);
  }

  @Patch(':boardId/:columnId')
  update (@Param('boardId') boardId: number,
          @Param('columnId') columnId:number, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(+boardId, +columnId, updateColumnDto.columName);
  }

  @Delete(':boardId/:columnId')
  async remove(@Param('boardId') boardId: number,
               @Param('columnId') columnId:number) {
    await this.columnsService.remove(+boardId, +columnId);
  }
}