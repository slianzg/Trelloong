import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Between, Repository } from 'typeorm';
import _ from 'lodash';
import { MemberService } from 'src/member/member.service';
import { MemberGuard } from 'src/auth/member.guard';
import { UpdateCardOrderDto } from './dto/update-cardOrder.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly memberService: MemberService,
  ) {}

  async create(createCardDto: CreateCardDto, columnsId: number) {
    const { cardName } = createCardDto;

    const card = await this.cardRepository.findOne({
      where: { columnsId },
      order: { cardOrder: 'DESC' },
    });

    let cardOrder = 1;

    if (card) {
      cardOrder = +card.cardOrder + 1;
    }

    await this.cardRepository.save({
      cardName,
      columnsId,
      cardOrder: +cardOrder,
    });
  }

  findAll(columnsId: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: { columnsId },
    });
  }

  findOne(columnsId: number, cardId: number) {
    const card = this.cardRepository.findOneBy({ columnsId, cardId });
    if (_.isNil(card)) {
      throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    }
    return card;
  }

  async cardUpdate(
    boardId: number,
    columnsId: number,
    cardId: number,
    updateCardeDto: UpdateCardDto,
  ) {
    const { cardName, cardDescription, cardColor, assignedTo } = updateCardeDto;

    const card = await this.cardRepository.findOneBy({
      columnsId: +columnsId,
      cardId: +cardId,
    });

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
      if (_.isNil(card.assignedTo)) {
        card.assignedTo = [];
        card.assignedTo.push(+assignedTo);
      } else {
        for (let existId of card.assignedTo) {
          if (+existId === +assignedTo) {
            let i = card.assignedTo.indexOf(+assignedTo);
            card.assignedTo.splice(i, 1);
          } else {
            card.assignedTo.push(+assignedTo);
          }
        }
      }
    }

    await this.cardRepository.save(card);
  }

  async delete(columnsId: number, cardId: number) {
    const deletedCard = await this.findOne(columnsId, cardId);
    if (!deletedCard) {
      throw new NotFoundException('해당 카드를 찾을 수 없습니다');
    }

    const deleteCardOrder = deletedCard.cardOrder;

    await this.cardRepository.delete({ columnsId, cardId });

    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({ cardOrder: () => 'cardOrder-1' })
      .where('columnId = :columnId AND cardOrder > :deleteCardOrder', {
        columnId: deletedCard.columnsId,
        deleteCardOrder,
      })
      .execute();
  }

  async updateCardOrder(
    cardId: number,
    columnsId: number,
    updateCardOrderDto: UpdateCardOrderDto,
  ) {
    const { inputColumn, inputOrder } = updateCardOrderDto;
    const card = await this.cardRepository.findOne({
      where: { cardId, columnsId },
    });
    const prevColumnId = card.columnsId;
    const prevCardOrder = card.cardOrder;

    if (inputColumn === prevColumnId) {
      if (prevCardOrder < inputOrder) {
        // prevCardOrder+1 ~ 가고싶은 cardOrder까지인 애들이 -1씩
        await this.moveCard(card, prevCardOrder + 1, inputOrder, -1);
      } else {
        // prevCardOrder-1 ~ 가고싶은 cardOrder까지인 애들이 +1씩
        await this.moveCard(card, prevCardOrder - 1, inputOrder, +1);
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
          columnsId,
          cardOrder: inputOrder,
        })
        .execute();

      await this.cardRepository
        .createQueryBuilder()
        .update(Card)
        .set({ cardOrder: inputOrder, columnsId: columnsId })
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
        columnsId: card.columnsId,
        cardOrder: Between(startOrder, endOrder),
      },
    });
    card.cardOrder = endOrder;
    for (const cardUpdate of cardsUpdate) {
      if (cardUpdate.cardId === card.cardId) continue;
      cardUpdate.cardOrder += step;
      await this.cardRepository.save(cardUpdate);
    }
    await this.cardRepository.save(card);
  }
}
