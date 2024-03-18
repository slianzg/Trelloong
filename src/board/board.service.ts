import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './entities/board.entity';
import { CreateBoardDto } from './dto/createBoard.dto';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { Members } from 'src/member/entities/member.entity';
import { DeleteBoardDto } from './dto/deleteBoard.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BoardService {
    constructor (
        @InjectRepository(Boards)
        private boardRepository : Repository<Boards>,
        @InjectRepository(Members)
        private membersRepository : Repository<Members>
        ) {}
    
    // 보드 생성
    async createBoard (createBoardDto : CreateBoardDto) {
    const boardInfo = await this.boardRepository.save({
            boardName : createBoardDto.name,
            boardDescription : createBoardDto.description,
            boardColor : createBoardDto.color
        })
        return boardInfo
    }

    // 보드 수정
    async updatedBoard (boardId : number, updatedBoardDto : UpdatedBoardDto) {
        const findBoard = await this.boardRepository.findOne({
            where : {
                boardId : +boardId
            }
        })
        
        if (!findBoard) {
            throw new NotFoundException ('수정하려는 보드가 존재하지 않습니다.')
        }

        const afterBoardInfo = await this.boardRepository.update(boardId,{
            boardName : updatedBoardDto.name,
            boardDescription : updatedBoardDto.description,
            boardColor : updatedBoardDto.color
        })
    return { afterBoardInfo }
    }

    // 보드 삭제
    async deleteBoard (member : Members, boardId : number, deleteBoardDto : DeleteBoardDto) {
        if (!boardId) {
            throw new NotFoundException ('삭제 하려는 보드가 존재하지 않습니다.')
        }
        
        // 삭제하기 위한 비밀번호 검증
        const savedPassword = await this.membersRepository.findOne({
            where : {
                email : member.email
            },
            select : {
                password : true
            }
        })

        if (!(await bcrypt.compare(deleteBoardDto.password, savedPassword.password))) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }

        this.boardRepository.delete({
            boardId : +boardId
        })
    }
}