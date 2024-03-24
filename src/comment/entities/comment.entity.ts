import { IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column('int', { nullable: false })
    userId: number;

    @IsString()
    @Column('varchar', { nullable: false })
    @IsNotEmpty({ message: '내용을 입력하세요.' })
    commentContent: string;

    @Column('int', { nullable: false })
    cardId: number;

    @CreateDateColumn()
    createdAt: Date;

    // @ManyToOne(() => Member, (member) => member.comments, { onDelete: 'CASCADE'})
    // @JoinColumn({ name: "userId", referencedColumnName: "memberId" })
    // member: Member;

    // @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE'})
    // @JoinColumn({ name: "cardId", referencedColumnName: "cardId" })
    // card: Card;
}