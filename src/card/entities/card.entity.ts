import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'bigint', default: 1 })
  cardOrder: number;
  @BeforeInsert()
  increaseOrder() {
    this.cardOrder++;
  }

  @Column({ type: 'varchar', nullable: true })
  cardColor: string;

  @Column({ type: 'json', nullable: true })
  assignedTo: any[];

  @Column()
  columnId: number;
}
