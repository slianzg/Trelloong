import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './entities/board.entity';
import { CreateBoardDto } from './dto/createBoard.dto';

@Injectable()
export class BoardService {
    constructor (
        @InjectRepository(Boards)
        private boardRepository : Repository<Boards>
    ) {}

    async createBoard (createBoardDto : CreateBoardDto) {
    const boardInfo = await this.boardRepository.save({
            boardName : createBoardDto.name,
            boardDescription : createBoardDto.description,
            boardColor : createBoardDto.color
        })
        return boardInfo
    }
}
