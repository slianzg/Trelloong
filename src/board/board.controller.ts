import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { UserInfo } from 'src/utils/custom-decorator.ts/userInfo.decorator';
import { DeleteBoardDto } from './dto/deleteBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthConfirmDto } from './dto/authConfirm.dto';
import { MemberGuard } from 'src/auth/member.guard';
import { Role } from 'src/types/role.type';
import { Roles } from 'src/auth/roles.decorator';


@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createBoard(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    const { userId } = req.user;
    const boardInfo = await this.boardService.createBoard(
      createBoardDto,
      userId,
    );
    return { message: '보드 생성이 완료되었습니다.', boardInfo };
  }

  // 인증 확인
  @UseGuards(AuthGuard('jwt'))
  @Patch('verify')
  async confirmToken(@Body() authConfirmDto: AuthConfirmDto, @Req() req) {
    const { userId } = req.user;
    await this.boardService.confirmToken(authConfirmDto, userId);
    return { message: '인증이 완료 되었습니다.' };
  }

  // 보드 수정
  @UseGuards(MemberGuard)
  @Roles(Role.Admin)
  @Patch('update/:boardId')
  async updatedBoard(
    @Param('boardId') boardId: number,
    @Body() updatedBoardDto: UpdatedBoardDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    await this.boardService.updatedBoard(boardId, updatedBoardDto, userId);
    return { message: '보드 수정이 완료되었습니다.' };
  }

  // 보드 삭제
  @UseGuards(MemberGuard)
  @Roles(Role.Admin)
  @Delete('delete/:boardId')
  async deleteBoard(
    @UserInfo() user: User,
    @Param('boardId') boardId: number,
    @Body() deleteBoardDto: DeleteBoardDto,
  ) {
    await this.boardService.deleteBoard(user, boardId, deleteBoardDto);
    return { message: '보드 삭제가 완료되었습니다.' };
  }

  // 보드 목록
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async boardList(@Req() req) {
    const { userId } = req.user;
    const boardListUp = await this.boardService.boardList(userId);
    return boardListUp;
  }

  // 멤버 초대
  @UseGuards(MemberGuard)
  @Roles(Role.Admin)
  @Post('invite/:boardId')
  async inviteMember(
    @Param('boardId') boardId: number,
    @Body() inviteBoardDto: InviteBoardDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    await this.boardService.inviteMember(boardId, inviteBoardDto, userId);
  }
}

