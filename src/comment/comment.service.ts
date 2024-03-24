import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async findAllComments(cardId: number) {
    const comments = await this.commentRepository.findBy({ cardId })

    if (!comments) {
      throw new NotFoundException("댓글이 없습니다.")
    } 
    return comments;
  } 

  async findCommentById(commentId: number) {
    const comment = await this.commentRepository.findOneBy({ commentId });

    if (!comment) {
      throw new NotFoundException('해당하는 댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findCommentById(commentId);
    console.log('--------userId', userId);
    console.log('--------comment', comment);

    if (comment.userId !== userId) {
      throw new UnauthorizedException('해당 댓글을 수정할 권한이 없습니다.');
    }

    const updateComment = await this.commentRepository.update(comment, updateCommentDto);

    return updateComment;
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.findCommentById(commentId);

    if (comment.userId !== userId) {
      throw new UnauthorizedException('해당 댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.delete(commentId);

    return { message: '해당 댓글이 삭제되었습니다.' }
  }

  
}
