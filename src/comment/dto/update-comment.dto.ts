import { PickType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';

export class UpdateCommentDto extends PickType(Comment, ['commentContent']) {}
