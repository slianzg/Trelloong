import { Boards } from "src/board/entities/board.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'user',
  })
export class User {
    @PrimaryGeneratedColumn()
    userId : number

    @OneToMany(() => Boards, (boards) => boards.userId)
    board : Boards[]

    @Column({ type: 'varchar', unique : true,  nullable : false })
    email : string

    @Column({ type: 'varchar', select : false, nullable : false })
    password : string

    @Column({ type: 'varchar', nullable : false })
    userName : string

    @Column({ type: 'varchar', nullable : true })
    contact? : string

    @DeleteDateColumn({ type: 'timestamp', select : false, nullable : true })
    deletedAt? : Date
}
