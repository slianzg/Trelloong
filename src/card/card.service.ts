import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { NotFoundError } from 'rxjs';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly groupService: GroupService,
  ) {}

  async create(createCardDto: CreateCardDto, columnId: number) {
    const { cardName } = createCardDto;

    await this.cardRepository.save({
      cardName,
      columnId,
    });
  }

  findAll(columnId: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: { columnId },
    });
  }

  findOne(columnId: number, cardId: number) {
    const card = this.cardRepository.findOneBy({ columnId, cardId });
    if (_.isNil(card)) {
      throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    }
  }

  async update(
    groupId: number,
    columnId: number,
    cardId: number,
    updateCardeDto: UpdateCardDto,
  ) {
    const { cardName, cardDescription, cardColor, assignedTo } = updateCardeDto;

    const card = await this.cardRepository.findOneBy({ columnId, cardId });

    if (_.isNil(card)) {
      throw new NotFoundException('카드를 찾지 못 했습니다.');
    }

    if (cardName) {
      card.cardName = cardName;
    }
    if (cardDescription) {
      card.cardDescription = cardDescription;
    }
    if (cardColor) {
      card.cardColor = cardColor;
    }
    if (assignedTo) {
      await this.groupService.compare(+groupId, assignedTo);
      if (card.assignedTo === assignedTo) {
        card.assignedTo = null;
      }
      card.assignedTo = assignedTo;
    }

    await this.cardRepository.save(card);
  }

  async delete(columnId: number, cardId: number) {
    this.findOne(columnId, cardId);
    await this.cardRepository.delete({ columnId, cardId });
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    return;
  }
}
