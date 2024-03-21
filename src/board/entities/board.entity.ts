import { Columns } from "src/column/entities/column.entity";
import { Member } from "src/member/entities/member.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'boards',
  })
  export class Board {
    @PrimaryGeneratedColumn()
    boardId: number

    @Column({ type: 'bigint', name : 'userId', nullable : false })
    userId : number

    @ManyToOne(() => User, (user) => user.board)
    @JoinColumn([{ name : 'userId', referencedColumnName: 'userId' }])
    user : User

    @OneToMany(() => Member, (members) => members.boardId)
    member: Member[]

    @OneToMany(() => Columns, (columns) => columns.boardId)
    column: Columns[]

    @Column({ type: 'varchar', nullable: false })
    boardName : string

    @Column({ type: 'varchar', nullable: false })
    boardDescription : string

    @Column({ type: 'varchar' })
    boardColor : string
}