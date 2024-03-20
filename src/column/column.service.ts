import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { MemberService } from 'src/member/member.service';


@Injectable()
export class ColumnsService {
    constructor(
        @InjectRepository(Columns)
        private readonly columnsRepository: Repository<Columns>,
        private readonly memberService: MemberService,
      ) {}


  async create(boardId:number, columName:string,  columnOrder:number) {

    await this.columnsRepository.save({
        boardId,
        columName,
        columnOrder,
    });
  }

   findAll(): Promise<Columns[]> {
    return this.columnsRepository.find();
  }



   findOne(boardId:number, columnId: number) {
    const columns = this.columnsRepository.findOneBy({boardId, columnId});
    if (_.isNil(columns)){
        throw new NotFoundException('해당 칼럼이 없습니다')
    }
  
}

  async update(boardId:number,columnId: number, columName:string) {
    await this.columnsRepository.save({
        boardId,
        columnId,
        columName,
    });
  }




  async remove(boardId:number, columnId: number) {
    this.findOne(boardId,columnId);
    await this.columnsRepository.delete({boardId,columnId});
  }
}