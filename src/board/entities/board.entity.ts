import { group } from "console";
import { Columns } from "src/columns/entities/column.entity";
import { Group } from "src/group/entities/group.entity";
import { Members } from "src/member/entities/member.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'boards',
  })
  // user 라는 테이블을 대표하는 객체
  // 이걸 통해 db와 orm이 통신함
  export class Boards {
    @PrimaryGeneratedColumn()
    boardId: number

    @Column({ type: 'bigint', name : 'memberId', nullable : false })
    memberId : number

    @ManyToOne(() => Members, (members) => members.boards)
    @JoinColumn({ name : 'memberId' })
    members : Members

    @OneToOne(() => Group, (group) => group.boardId)
    group: Group[]

    @OneToMany(() => Columns, (columns) => columns.boardId)
    columns: Columns[]

    @Column({ type: 'varchar', nullable: false })
    boardName : string

    @Column({ type: 'varchar', nullable: false })
    boardDescription : string

    @Column({ type: 'varchar' })
    boardColor : string
}