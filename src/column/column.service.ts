import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnsRepository: Repository<Columns>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createColumnDto: CreateColumnDto, boardId: number) {
    const { columnName } = createColumnDto;

    const existBoard = await this.boardRepository.findOneBy({ boardId });

    if (!existBoard) {
      throw new NotFoundException('해당 보드가 없습니다.');
    }

    // 해당 보드에 속한 컬럼 중 가장 높은 columnOrder 값을 쿼리 빌더로 찾음
    const highestOrderResult = await this.columnsRepository
      .createQueryBuilder('column')
      .select('MAX(column.columnOrder)', 'maxOrder')
      .where('column.boardId = :boardId', { boardId })
      .getRawOne();

    let newColumnOrder = 1; // 기본값 설정, 컬럼이 없을 경우 1로 시작
    if (highestOrderResult && highestOrderResult.maxOrder !== null) {
      // 결과값이 문자열로 반환될 수 있으므로 숫자로 변환
      const highestOrder = parseInt(highestOrderResult.maxOrder, 10);
      newColumnOrder = highestOrder + 1;
    }

    // 새 컬럼 객체 생성 및 저장
    const newColumn = await this.columnsRepository.save({
      boardId,
      columnName,
      columnOrder: newColumnOrder,
    });

    return newColumn; // 생성된 컬럼 객체 반환
  }

  async findAll(boardId: number): Promise<Columns[]> {
    const columns = await this.columnsRepository.find({
      where: {
        boardId: boardId,
      },
      order: {
        columnOrder: 'ASC',
      },
      select: ['columnId', 'columnName', 'columnOrder'],
    });
    if (columns.length === 0) {
      throw new NotFoundException(` 컬럼이나 id${boardId}인 보드가 없습니다.`);
    }

    return columns;
  }

  async findOne(boardId: number, columnId: number) {
    const columns = await this.columnsRepository.findOneBy({
      boardId,
      columnId,
    });
    if (_.isNil(columns)) {
      throw new NotFoundException('해당 칼럼이 없습니다');
    }
    return columns;
  }
  //1
  async update(boardId: number, columnId: number, columnName: string) {
    const column = await this.columnsRepository.findOne({
      where: {
        columnId: columnId,
        boardId: boardId,
      },
    });

    if (!column) {
      throw new NotFoundException(
        ` id${columnId} 컬럼이나  id${boardId} 보드가 없습니다.`,
      );
    }

    const columns = await this.columnsRepository.findOneBy({
      boardId,
      columnId,
    });

    if (_.isNil(columns)) {
      throw new NotFoundException('해당 칼럼이 없습니다');
    }

    await this.columnsRepository.save({
      boardId,
      columnId,
      columnName,
    });
  }

  async updateColumnOrder(
    columnId: number,
    boardId: number,
    columnOrder: number,
  ) {
    const columns = await this.columnsRepository.findOne({
      where: {
        columnId: columnId,
        boardId: boardId,
      },
    });

    if (!columns) {
      throw new NotFoundException(
        `id${columnId} 컬럼이나  id${boardId} 보드가 없습니다.`,
      );
    }
    const column = await this.columnsRepository.findOneBy({ columnId });
    const previousOrder = column.columnOrder;

    // 새로운 순서가 기존 순서보다 큰 경우
    if (columnOrder > previousOrder) {
      await this.columnsRepository
        .createQueryBuilder()
        .update()
        .set({
          columnOrder: () => 'columnOrder - 1',
        })
        .where('columnOrder > :previousOrder AND columnOrder <= :columnOrder', {
          previousOrder,
          columnOrder,
        })
        .execute();
    }
    // 새로운 순서가 기존 순서보다 작은 경우
    else if (columnOrder < previousOrder) {
      await this.columnsRepository
        .createQueryBuilder()
        .update()
        .set({
          columnOrder: () => 'columnOrder + 1',
        })
        .where('columnOrder < :previousOrder AND columnOrder >= :columnOrder', {
          previousOrder,
          columnOrder,
        })
        .execute();
    }
    ///asd
    //파이프 유효성검사ㄴ
    // 현재 column의 순서 업데이트
    column.columnOrder = columnOrder;
    await this.columnsRepository.save(column);
  }
 



  async remove(boardId:number, columnId: number) {
    this.findOne(boardId,columnId);
    await this.columnsRepository.delete({boardId,columnId});

      // 새로운 순서가 기존 순서보다 큰 경우
     {
      await this.columnsRepository
      .createQueryBuilder()
      .update(Columns)
      .set({
        columnOrder: () => 'columnOrder - 1',
      })
      .where('columnOrder > :deletedColumnorder AND boardId = :boardId', { deletedColumnorder, boardId })
      .execute();
  }

  }

  
}
