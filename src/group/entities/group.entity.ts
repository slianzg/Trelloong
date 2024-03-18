import { Boards } from "src/board/entities/board.entity";
import { Role } from "src/types/role.type";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity ({
    name : 'group'
})
export class Group {
    @PrimaryGeneratedColumn()
    groupId : number

    @Column ({ type : 'bigint', nullable : false})
    memberId : number

    @Column({ type: 'bigint', name : 'boardId', nullable: false })
    boardId : number

    @OneToOne(() => Boards, (boards) => boards.boardId)
    @JoinColumn({ name : 'boardId' })
    boards : Boards

    @Column({ type: 'enum', enum: Role })
    role : Role
}
