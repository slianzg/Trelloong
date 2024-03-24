import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { MemberGuard } from 'src/auth/member.guard';
import { CardService } from 'src/card/card.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('COMMENT')
@UseGuards(MemberGuard)
@Controller('board/:boardId/column/:columnId/card/:cardId/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  // 댓글 생성
  @ApiOperation({ summary: '댓글 생성' })
  @Post('create')
  async createComment(
    @Param('cardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    try {
      await validate(createCommentDto);

      const { userId } = req.user;

      await this.commentService.createComment(createCommentDto, userId, cardId);
      return { message: '댓글을 작성하였습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  // 댓글 목록 조회
  @ApiOperation({ summary: '댓글 목록 조회' })
  @Get('commentList')
  async findAllComments(@Param('cardId') cardId: number) {
    try {
      return await this.commentService.findAllComments(cardId);
    } catch (err) {
      return { message: `${err}` };
    }
  }

  // 댓글 수정
  @ApiOperation({ summary: '댓글 수정' })
  @Patch('update/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Req() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    try {
      const { userId } = req.user;
      await this.commentService.updateComment(
        commentId,
        userId,
        updateCommentDto,
      );
      return { message: '해당 댓글이 수정되었습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  // 댓글 삭제
  @ApiOperation({ summary: '댓글 삭제' })
  @Delete('delete/:commentId')
  async deleteComment(@Param('commentId') commentId: number, @Req() req) {
    try {
      const { userId } = req.user;
      return await this.commentService.deleteComment(commentId, userId);
    } catch (err) {
      return { message: `${err}` };
    }
  }
}
