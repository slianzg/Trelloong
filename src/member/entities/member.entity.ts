import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'members',
})
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  memberName: string;

  @Column({ type: 'varchar', nullable: true })
  contact?: string;

  @DeleteDateColumn({ type: 'timestamp', select: false, nullable: true })
  deletedAt?: Date;
}
