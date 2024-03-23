import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MemberModule } from 'src/member/member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), MemberModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
