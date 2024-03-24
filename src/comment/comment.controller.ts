import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { userInfo } from 'os';
import { Member } from 'src/member/entities/member.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('create')
  async createComment(
    @Param("cardId") cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    // @userInfo() user: User
  ) {
    try {
      await validate(createCommentDto)
      // createCommentDto.userId = user.userId;
      // await this.cardService.findCardById(cardId)
      createCommentDto.cardId = cardId;
      await this.commentService.createComment(createCommentDto)
      return { message: '댓글을 작성하였습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Get('commentList')
  async findAllComments(
    @Param("cardId") cardId: number
  ) {
    try {
      // await this.cardService.findCardById(cardId)
      return await this.commentService.findAllComments(cardId);
    } catch (err) {
      return { message: `${err}` };
    }
  }

  // 파라미터로 받아와야하는 것들 : commentId, userId, commentContent
  @Patch('update/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    // @userInfo() user: User,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    try {
      // await this.commentService.updateComment(commentId, user.userId, updateCommentDto);
      return { message: '해당 댓글이 수정되었습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }

  @Delete('delete/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    // @userInfo() user: User,
  ) {
    try {
      // await this.commentService.deleteComment(commentId, user.userId);
      return { message: '해당 댓글이 삭제되었습니다.' };
    } catch (err) {
      return { message: `${err}` };
    }
  }
}
