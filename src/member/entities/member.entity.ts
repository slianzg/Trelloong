import { Board } from 'src/board/entities/board.entity';
import { Role } from 'src/types/role.type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'members',
})
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column({ type: 'bigint', name: 'userId', nullable: false })
  userId: number;

  @Column({ type: 'bigint', name: 'boardId', nullable: false })
  boardId: number;

  @ManyToOne(() => Board, (board) => board.boardId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'boardId' })
  board: Board;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role;

  @Column({ type: 'int', select: false, nullable: true })
  verificationToken: number;
}

