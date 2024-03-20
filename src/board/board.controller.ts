import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    const boardInfo = await this.boardService.createBoard(createBoardDto);
    return { message: '보드 생성이 완료되었습니다.', boardInfo };
  }

  // 보드 수정
  @Patch(':boardId')
  async updatedBoard(
    @Param('boardId') boardId: number,
    @Body() updatedBoardDto: UpdatedBoardDto,
  ) {
    const afterBoardInfo = await this.boardService.updatedBoard(
      boardId,
      updatedBoardDto,
    );
    return { message: '보드 수정이 완료되었습니다.', afterBoardInfo };
  }

  // 보드 삭제
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':boardId')
  async deleteBoard(
    @MemberInfo() member: Members,
    @Param('boardId') boardId: number,
    @Body() deleteBoardDto: DeleteBoardDto,
  ) {
    await this.boardService.deleteBoard(member, boardId, deleteBoardDto);
    return { message: '보드 삭제가 완료되었습니다.' };
  }

  // 보드 목록
  @Get()
  async boardList() {
    const boardListUp = await this.boardService.boardList();
    return { boardListUp };
  }

  // 멤버 초대
  async inviteMember () {
    // 1. Group에 등록된 인원 중 한명의 정보(이메일)를 받아온다.
  
  }
  
  // 2. 그 사람의 이메일로 노드메일러를 통해 인증 메일을 발송한다.
  // 3. 인증 번호를 입력하면 등록 완료.....?
}
