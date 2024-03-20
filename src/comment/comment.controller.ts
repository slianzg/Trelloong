import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { validate } from 'class-validator';
import { userInfo } from 'os';
import { Member } from 'src/member/entities/member.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // @UseGuards(AuthGuard(""))
  @Post()
  async createComment(
    @Query("cardId") cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    // @memberInfo() member: Member
  ) {
    await validate(createCommentDto)

    // createCommentDto.memberId = member.memberId;

    // await this.cardService.findCardById(cardId)
    createCommentDto.cardId = cardId;

    return await this.commentService.createComment(createCommentDto)
  }

  @Get()
  async findComments(
    @Query("cardId") cardId: number
  ) {
    // await this.cardService.findCardById(cardId)

    return await this.commentService.findComments(cardId);
  }

  
}
