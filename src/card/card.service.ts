import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
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
    columnId: number,
    cardId: number,
    updateCardeDto: UpdateCardDto,
    file: Express.Multer.File,
  ) {
    const card = await this.cardRepository.findOneBy({ columnId, cardId });

    if (_.isNil(card)) {
      throw new NotFoundException('카드를 찾지 못 했습니다.');
    }

    if (updateCardeDto.cardName) {
      card.cardName = updateCardeDto.cardName;
    }
    if (updateCardeDto.cardDescription) {
      card.cardDescription = updateCardeDto.cardDescription;
    }
    if (updateCardeDto.cardColor) {
      card.cardColor = updateCardeDto.cardColor;
    }
    if (updateCardeDto.assignedTo) {
      card.assignedTo = updateCardeDto.assignedTo;
    }
  }

  async delete(columnId: number, cardId: number) {
    this.findOne(columnId, cardId);
    await this.cardRepository.delete({ columnId, cardId });
  }
}
