import { Columns } from "src/columns/entities/column.entity";
import { Members } from "src/member/entities/member.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'boards',
  })
  export class Boards {
    @PrimaryGeneratedColumn()
    boardId: number

    @Column({ type: 'bigint', name : 'userId', nullable : false })
    userId : number

    @ManyToOne(() => User, (user) => user.boards)
    @JoinColumn([{ name : 'userId', referencedColumnName: 'userId' }])
    user : User

    @OneToMany(() => Members, (members) => members.boardId)
    members: Members[]

    @OneToMany(() => Columns, (columns) => columns.boardId)
    columns: Columns[]

    @Column({ type: 'varchar', nullable: false })
    boardName : string

    @Column({ type: 'varchar', nullable: false })
    boardDescription : string

    @Column({ type: 'varchar' })
    boardColor : string
}