import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Between, Repository } from 'typeorm';
import _ from 'lodash';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly memberService: MemberService,
  ) {}

  async create(createCardDto: CreateCardDto, columnId: number) {
    const { cardName } = createCardDto;

    const card = await this.cardRepository.findOne({
      where: { columnId },
      order: { cardOrder: 'DESC' },
    });
    if (card.cardOrder) {
      const cardOrder = card.cardOrder + 1;
      await this.cardRepository.save({
        cardName,
        columnId,
        cardOrder,
      });
    }

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
    return card;
  }

  async cardUpdate(
    boardId: number,
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
      await this.memberService.compare(+boardId, assignedTo);
      for (let existId in card.assignedTo) {
        for (let inputId in assignedTo) {
          existId === inputId
            ? existId === null
            : card.assignedTo.push(inputId);
        }
      }
    }

    await this.cardRepository.save(card);
  }

  async delete(columnId: number, cardId: number) {
    const deletedCard = await this.findOne(columnId, cardId);
    if (!deletedCard) {
      throw new NotFoundException('해당 카드를 찾을 수 없습니다');
    }

    const deleteCardOrder = deletedCard.cardOrder;

    await this.cardRepository.delete({ columnId, cardId });

    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({ cardOrder: () => 'cardOrder-1' })
      .where('columnId = :columnId AND cardOrder > :deleteCardOrder', {
        columnId: deletedCard.columnId,
        deleteCardOrder,
      })
      .execute();
  }

  async updateCardOrder(cardId: number, columnId: number, cardOrder: number) {
    const card = await this.cardRepository.findOne({ where: { cardId } });
    const prevColumnId = card.columnId;
    const prevCardOrder = card.cardOrder;

    if (columnId === prevColumnId) {
      if (prevCardOrder < cardOrder) {
        // prevCardOrder+1 ~ 가고싶은 cardOrder까지인 애들이 -1씩
        await this.moveCard(card, prevCardOrder + 1, cardOrder, -1);
      } else {
        // prevCardOrder-1 ~ 가고싶은 cardOrder까지인 애들이 +1씩
        await this.moveCard(card, prevCardOrder - 1, cardOrder, +1);
      }
    } else {
      // 1. previousColumnId 인 카드들은 previousCardOrder보다 뒤에있는 카드라면 전부 순서가 1씩 당겨져야 한다.
      await this.cardRepository
        .createQueryBuilder()
        .update(Card)
        .set({ cardOrder: () => 'cardOrder-1' })
        .where('columnId = :prevColumnId AND cardOrder >= :prevCardOrder', {
          prevColumnId,
          prevCardOrder,
        })
        .execute();
      // 2. columnId 인 카드들은 cardOrder보다 뒤에있는 카드라면 전부 순서가 뒤로 +1씩 늘어나야한다.
      await this.cardRepository
        .createQueryBuilder()
        .update(Card)
        .set({ cardOrder: () => 'cardOrder+1' })
        .where('columnId=:columnId AND cardOrder >= :cardOrder', {
          columnId,
          cardOrder,
        })
        .execute();

      await this.cardRepository
        .createQueryBuilder()
        .update(Card)
        .set({ cardOrder: cardOrder, columnId: columnId })
        .where('cardId = cardID', { cardId })
        .execute();
    }
  }

  async moveCard(
    card: Card,
    startOrder: number,
    endOrder: number,
    step: number,
  ) {
    const cardsUpdate = await this.cardRepository.find({
      where: {
        columnId: card.columnId,
        cardOrder: Between(startOrder, endOrder),
      },
    });
    for (const cardUpdate of cardsUpdate) {
      if (cardUpdate.cardId === card.cardId) continue;
      cardUpdate.cardOrder += step;
      await this.cardRepository.save(cardUpdate);
    }
  }
}
