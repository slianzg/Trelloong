import { Group } from 'src/group/entities/group.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'members',
})
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @OneToMany(() => Group, (group) => group.member)
  groups: Group[];
}
