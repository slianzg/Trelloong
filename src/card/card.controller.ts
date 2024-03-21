import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  
  @Post('/:cardId')
  async setDueDate(
    @Param('cardId') cardId: number,
    @Body('dueDate') dueDate: Date
  ) {
    try {
      return await this.cardService.setDueDate(cardId, dueDate);
    } catch (err) {
      return { message: `${err}` }
    }
  }
}
