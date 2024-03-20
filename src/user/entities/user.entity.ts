import { Member } from 'src/member/entities/member.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];
}
