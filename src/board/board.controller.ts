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
import { UserInfo } from 'src/utils/custom-decorator.ts/userInfo.decorator';
import { DeleteBoardDto } from './dto/deleteBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthConfirmDto } from './dto/authConfirm.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @Post('create')
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    const boardInfo = await this.boardService.createBoard(createBoardDto);
    return { message: '보드 생성이 완료되었습니다.', boardInfo };
  }

  // 보드 수정
  @Roles(Role.Admin)
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
    @UserInfo() user : User,
    @Param('boardId') boardId: number,
    @Body() deleteBoardDto: DeleteBoardDto,
  ) {
    await this.boardService.deleteBoard(user, boardId, deleteBoardDto);
    return { message: '보드 삭제가 완료되었습니다.' };
  }

  // 보드 목록
  @Get()
  async boardList() {
    const boardListUp = await this.boardService.boardList();
    return { boardListUp };
  }

  // 멤버 초대
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':boardId')
  async inviteMember (@Param('boardId') boardId : number, @Body() inviteBoardDto : InviteBoardDto ) {
    await this.boardService.inviteMember(boardId, inviteBoardDto)
  }

  // 인증 확인
  @Patch('/verify')
  async confirmToken (@Body() authConfirmDto : AuthConfirmDto) {
    await this.boardService.confirmToken(authConfirmDto)
  }
}
