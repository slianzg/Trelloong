import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { validate } from 'class-validator';
import { MemberGuard } from 'src/auth/member.guard';
import { CardService } from 'src/card/card.service';
import { Member } from 'src/member/entities/member.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(MemberGuard)
@Controller('board/:boardId/column/:columnId/card/:cardId/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly cardService: CardService
  ) { }

  @Post('create')
  async createComment(
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req () req
  ) {
    try {
      await validate(createCommentDto)

      createCommentDto.userId = req.user.userId;

      await this.cardService.findOne(columnId, cardId);
      createCommentDto.cardId = cardId;

      await this.commentService.createComment(createCommentDto)
      return { message: '댓글을 작성하였습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Get('commentList')
  async findAllComments(
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number
  ) {
    try {
      await this.cardService.findOne(columnId, cardId);
      return await this.commentService.findAllComments(cardId);
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Patch('update/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Req () req,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    try {
      const { userId } = req.user
      await this.commentService.updateComment(commentId, userId, updateCommentDto);
      return { message: '해당 댓글이 수정되었습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Delete('delete/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Req () req,
  ) {
    try {
      const { userId } = req.user
      return await this.commentService.deleteComment(commentId, userId);
    } catch (err) {
      return { message: `${err}` };
    }
  }
}
