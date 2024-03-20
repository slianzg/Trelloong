import { Member } from 'src/member/entities/member.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'boards',
})
export class Board {
  @PrimaryColumn()
  boardId: number;

  @OneToMany(() => Member, (member) => member.board)
  members: Member[];
}
