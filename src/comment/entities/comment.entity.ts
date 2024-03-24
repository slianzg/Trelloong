import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { Member } from 'src/member/entities/member.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @IsNumber()
    @Column('varchar', { nullable: false })
    userId: number;

    @IsString()
    @Column('varchar', { nullable: false })
    @IsNotEmpty({ message: '내용을 입력하세요.' })
    commentContent: string;

    @IsNumber()
    @Column('int', { nullable: false })
    cardId: number;

    @CreateDateColumn()
    @Column('date', { nullable: false })
    createdAt: Date;

    // @ManyToOne(() => Member, (member) => member.comments, { onDelete: 'CASCADE'})
    // @JoinColumn({ name: "userId", referencedColumnName: "memberId" })
    // member: Member;

    // @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE'})
    // @JoinColumn({ name: "cardId", referencedColumnName: "cardId" })
    // card: Card;
}