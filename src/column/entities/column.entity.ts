
import { Board } from "src/board/entities/board.entity";
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

    @ManyToOne(() => Board, (board) => board.column)
    @JoinColumn({ name : 'boardId' })
    board : Board
}
