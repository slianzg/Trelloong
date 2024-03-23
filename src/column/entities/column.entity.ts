import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'columns',
})
export class Columns {
  @PrimaryGeneratedColumn()
  columnId: number;

  @Column({ type: 'varchar', nullable: false })
  columnName: string;

  @Column({ type: 'bigint', nullable: false })
  columnOrder: number;

  @Column({ type: 'bigint', name: 'boardId', nullable: false })
  boardId: number;

  @ManyToOne(() => Board, (board) => board.column)
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @OneToMany(() => Card, (card) => card.columns)
  cards: Card[];
}
