import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { Member } from 'src/member/entities/member.entity';


@Injectable()
export class ColumnsService {
    constructor(
        @InjectRepository(Columns)
        private readonly columnsRepository: Repository<Columns>,
        // @InjectRepository(Member)
        // private memberRepository: Repository<Member>
      ) {}


  async create(boardId:number, columnName:string,  columnOrder:number) {

    await this.columnsRepository.save({
        boardId,
        columnName,
        columnOrder,
    });
  }

   findAll(): Promise<Columns[]> {
    return this.columnsRepository.find({
      order: {
        columnOrder: 'ASC',
      }
    });
  }



  async findOne(boardId:number, columnId: number) {
    const columns = await this.columnsRepository.findOneBy({boardId, columnId});
    if (_.isNil(columns)){
        throw new NotFoundException('해당 칼럼이 없습니다')
    }
  return columns
}

  async update(boardId:number,columnId: number, columnName:string) {

    const columns = await this.columnsRepository.findOneBy({boardId, columnId});

    if (_.isNil(columns)){
        throw new NotFoundException('해당 칼럼이 없습니다')
    }

    await this.columnsRepository.save({
        boardId,
        columnId,
        columnName,
    });
  }

  async updateColumnOrder(columnId: number, columnOrder: number) {
    const column = await this.columnsRepository.findOneBy({ columnId });
    const previousOrder = column.columnOrder;
    
    // 새로운 순서가 기존 순서보다 큰 경우
    if (columnOrder > previousOrder) {
      await this.columnsRepository
        .createQueryBuilder()
        .update()
        .set({ 
          columnOrder: () => "columnOrder - 1" 
        })
        .where("columnOrder > :previousOrder AND columnOrder <= :columnOrder", { previousOrder, columnOrder })
        .execute();
    } 
    // 새로운 순서가 기존 순서보다 작은 경우
    else if (columnOrder < previousOrder) {
      await this.columnsRepository
        .createQueryBuilder()
        .update()
        .set({ 
          columnOrder: () => "columnOrder + 1" 
        })
        .where("columnOrder < :previousOrder AND columnOrder >= :columnOrder", { previousOrder, columnOrder })
        .execute();
    }
  //파이프 유효성검사ㄴ
    // 현재 column의 순서 업데이트
    column.columnOrder = columnOrder;
    await this.columnsRepository.save(column);
  }
  
  
 



  async remove(boardId:number, columnId: number) {
    this.findOne(boardId,columnId);
    await this.columnsRepository.delete({boardId,columnId});
  }
}