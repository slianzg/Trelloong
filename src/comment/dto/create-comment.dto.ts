import { PickType } from "@nestjs/mapped-types";
import { Comment } from "../entities/comment.entity";

export class CreateCommentDto extends PickType(Comment, [
    "userId",
    "cardId",
    "commentContent"
]){
  static cardId: any;
}
