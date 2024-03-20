import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [MemberModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
