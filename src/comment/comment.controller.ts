import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { userInfo } from 'os';
import { MemberGuard } from 'src/auth/member.guard';
import { CardService } from 'src/card/card.service';
import { Member } from 'src/member/entities/member.entity';
import { MemberInfo } from 'util/memberInfo.decorator';
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
    @MemberInfo() member: Member,
  ) {
    try {
      await validate(createCommentDto)

      createCommentDto.userId = member.userId;

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
    @MemberInfo() member: Member,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    try {
      await this.commentService.updateComment(commentId, member.userId, updateCommentDto);
      return { message: '해당 댓글이 수정되었습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Delete('delete/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @MemberInfo() member: Member,
  ) {
    try {
      return await this.commentService.deleteComment(commentId, member.userId);
    } catch (err) {
      return { message: `${err}` };
    }
  }
}
