import { Columns } from 'src/column/entities/column.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'cards',
})
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column({ type: 'varchar', nullable: false })
  cardName: string;

  @Column({ type: 'text', nullable: true })
  cardDescription: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  setDueDate(date: Date) {
    this.dueDate = date;
  }

  @Column({ type: 'int' })
  cardOrder: number;

  @Column({ type: 'varchar', nullable: true })
  cardColor: string;

  @Column({ type: 'json', nullable: true })
  assignedTo: any[];

  @ManyToOne(() => Columns, (columns) => columns.cards, {
    onDelete: 'CASCADE',
  })
  columns: Columns;

  @Column({ type: 'int', name: 'columnsId' })
  columnsId: number;
}
