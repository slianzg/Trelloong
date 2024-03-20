
import { Boards } from 'src/board/entities/board.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
 
  
  @Entity({
    name: 'columns',
  })
  export class Columns {
    @PrimaryGeneratedColumn()
    columnId: number;
  
    @Column({ type: 'varchar', unique: true, nullable: false })
    columName: string;
  
    @Column({ type: 'int', select: false, nullable: false })
    columnOrder: number;
  

    @Column()
    boardId: number;
    // @ManyToOne(() => Boards, (board) => board.boardId)
    // board: Boards[];
  }