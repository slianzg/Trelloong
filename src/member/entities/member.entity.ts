import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'members',
})
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @ManyToOne(() => User, (user) => user.members, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'bigint', name: 'userID' })
  userId: number;

  @ManyToOne(() => Board, (board) => board.members, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Column({ type: 'bigint', name: 'boardId' })
  boardId: number;
}
