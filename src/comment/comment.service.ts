import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save(createCommentDto)
  }

  async findComments(cardId: number) {
    const comments = await this.commentRepository.findBy({ cardId })

    if (!comments) {
      throw new NotFoundException("댓글이 없습니다.")
    } 
    return comments;
  } 


}
