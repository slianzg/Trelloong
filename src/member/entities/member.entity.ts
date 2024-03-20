import { Boards } from "src/board/entities/board.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'members',
  })
export class Members {
    @PrimaryGeneratedColumn()
    memberId : number

    @Column({ type: 'bigint', name : 'boardId', nullable : false })
    boardId : number

    @ManyToOne(() => Boards, (boards) => boards.boardId)
    @JoinColumn({ name : 'boardId' })
    boards: Boards

    @Column({ type: 'varchar', name : 'memberName', nullable: false })
    memberName : string

    @Column({ type: 'varchar', name : 'email', nullable: false })
    email : string

    @Column({ type: 'varchar', name : 'password', nullable: false })
    password : string

    @Column({ type: 'varchar', name : 'contact', nullable: false })
    contact : string
}
