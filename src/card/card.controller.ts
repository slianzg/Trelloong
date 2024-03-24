import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MemberInfo } from 'util/memberInfo.decorator';
import { Member } from 'src/member/entities/member.entity';
import { MemberGuard } from 'src/auth/member.guard';
import { UpdateCardOrderDto } from './dto/update-cardOrder.dto';

@UseGuards(MemberGuard)
@Controller('board/:boardId/column/:columnsId/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  async create(
    @Param('columnsId') columnsId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    await this.cardService.create(createCardDto, +columnsId);
  }
  @Patch('update/:cardId')
  cardUpdate(
    @MemberInfo() member: Member,
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardeDto: UpdateCardDto,
  ) {
    this.cardService.cardUpdate(
      +member.boardId,
      +columnsId,
      +cardId,
      updateCardeDto,
    );
  }

  @Get('cardList')
  findAll(@Param('columnsId') columnId: number) {
    return this.cardService.findAll(+columnId);
  }

  @Get('cardInfo/:cardId')
  findOne(
    @Param('columnsId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    return this.cardService.findOne(+columnId, +cardId);
  }

  @Delete('delete/:cardId')
  async delete(
    @Param('columnsId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    await this.cardService.delete(+columnId, +cardId);
  }

  @Patch('orderUpdate/:cardId')
  updateCardOrder(
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardOrderDto: UpdateCardOrderDto,
  ) {
    this.cardService.updateCardOrder(+cardId, +columnsId, updateCardOrderDto);
  }
}
