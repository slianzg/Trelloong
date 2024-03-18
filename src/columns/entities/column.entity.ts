import { Boards } from "src/board/entities/board.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'columns'
})
export class Columns {
    @PrimaryGeneratedColumn()
    columnId : number

    @Column ({type : 'varchar', nullable : false })
    columnName : string

    @Column ({type : 'bigint', nullable : false })
    columnOrder : number

    @Column ({type : 'bigint', name : 'boardId', nullable : false})
    boardId : number

    @ManyToOne(() => Boards, (boards) => boards.columns)
    @JoinColumn({ name : 'boardId' })
    boards : Boards
}
