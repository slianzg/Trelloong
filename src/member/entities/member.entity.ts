import { Board } from "src/board/entities/board.entity";
import { Role } from "src/types/role.type";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'members',
  })
export class Member {
    @PrimaryGeneratedColumn()
    memberId : number

    @Column({ type: 'bigint', name : 'userId', nullable : false})
    userId : number

    @Column({ type: 'bigint', name : 'boardId' })
    boardId : number

    @ManyToOne(() => Board, (board) => board.boardId, { onDelete : "CASCADE" })
    @JoinColumn({ name : 'boardId', referencedColumnName: 'boardId'})
    board: Board

    @ManyToOne(() => User, (user) => user.userId)
    @JoinColumn({ name : 'userId' })
    user : User

    @Column({ type: 'enum', enum : Role, nullable: false })
    role : Role

    // 인증 번호 컬럼인데 어디다 둬야 최선인지 모르겠어서 일단 멤버에다 추가
    @Column({ type : 'int', select : false })
    verificationToken : number
}
