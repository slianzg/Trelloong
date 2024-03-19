import { Member } from 'src/member/entities/member.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'groups',
})
export class Group {
  @PrimaryGeneratedColumn()
  groupId: number;

  @ManyToOne(() => Member, (member) => member.groups, {
    onDelete: 'CASCADE',
  })
  member: Member;

  @Column({ type: 'bigint', nullable: false })
  memberId: number;
}
