import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [GroupModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
