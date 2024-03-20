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
  

  
    // @ManyToOne(() => Board, (board) => board.id)
    // board: Board[];
  }