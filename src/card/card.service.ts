import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card) private readonly cardRepository: Repository<Card>
  ) {}
    
  async setDueDate(cardId: number, dueDate: Date) {
    // cardRepository에서 cardId가 있는지 확인
    const card = await this.findCardById(cardId);

    // 해당 카드에 dueDate를 새로운 dueDate로 바꿔주고 setDudate에 저장
    card.dueDate = dueDate;
    const setDueDate = await this.cardRepository.save(card);
    return setDueDate
  }

  // 해당 카드가 레포지터리에 없을때
  async findCardById(cardId: number) {
    const card = await this.cardRepository.findOneBy({ cardId })
    if(!card) {
        throw new NotFoundException ('해당카드를 찾을수 없습니다.')
    }
    return card;
  }

  
}
