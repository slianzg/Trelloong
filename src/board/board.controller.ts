import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import { Role } from 'src/types/role.type';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';

@Controller('boards')
export class BoardController {
    constructor (private readonly boardService : BoardService) {}

    // 보드 생성
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post('create')
    async createBoard (createBoardDto : CreateBoardDto) {
    const boardInfo = await this.boardService.createBoard(createBoardDto)
    return { message : '보드 생성이 완료되었습니다.', boardInfo }
    }

    // 보드 수정
    @Patch(':boardId')
    async updatedBoard (@Param('boardId') boardId : number, updatedBoardDto : UpdatedBoardDto) {
    const afterBoardInfo = await this.boardService.updatedBoard(boardId, updatedBoardDto)
    return { message : '보드 수정이 완료되었습니다.', afterBoardInfo}
    }
}
