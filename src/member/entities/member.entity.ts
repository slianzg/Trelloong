import { Boards } from "src/board/entities/board.entity";
import { Role } from "src/types/role.type";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'members',
  })
export class Members {
    @PrimaryGeneratedColumn()
    memberId : number

    @Column({ type: 'bigint', name : 'userId', nullable : false})
    userId : number

    @Column({ type: 'bigint', name : 'boardId', nullable : false })
    boardId : number

    @ManyToOne(() => Boards, (boards) => boards.boardId)
    @JoinColumn({ name : 'boardId' })
    boards: Boards

    @ManyToOne(() => User, (users) => users.userId)
    @JoinColumn({ name : 'userId' })
    users : User

    @Column({ type: 'enum', enum : Role, nullable: false })
    role : Role

    // 인증 번호 컬럼인데 어디다 둬야 최선인지 모르겠어서 일단 멤버에다 추가
    @Column({ type : 'bigint', select : false })
    verificationToken : number
}
