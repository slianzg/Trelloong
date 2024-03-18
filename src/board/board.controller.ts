import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import { Role } from 'src/types/role.type';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { Members } from 'src/member/entities/member.entity';
import { MemberInfo } from 'src/utils/memborInfo.decorator';
import { DeleteBoardDto } from './dto/deleteBoard.dto';

@Controller('boards')
export class BoardController {
    constructor (private readonly boardService : BoardService) {}

    // 보드 생성
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post('create')
    async createBoard (@Body() createBoardDto : CreateBoardDto) {
    const boardInfo = await this.boardService.createBoard(createBoardDto)
    return { message : '보드 생성이 완료되었습니다.', boardInfo }
    }

    // 보드 수정
    @Patch(':boardId')
    async updatedBoard (@Param('boardId') boardId : number, @Body() updatedBoardDto : UpdatedBoardDto) {
    const afterBoardInfo = await this.boardService.updatedBoard(boardId, updatedBoardDto)
    return { message : '보드 수정이 완료되었습니다.', afterBoardInfo}
    }

    // 보드 삭제
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Delete(':boardId')
    async deleteBoard (@MemberInfo() member : Members, @Param('boardId') boardId : number, @Body() deleteBoardDto : DeleteBoardDto) {
        await this.boardService.deleteBoard(member, boardId, deleteBoardDto)
    return { message : '보드 삭제가 완료되었습니다.' }
    }
}
