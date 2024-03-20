import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MemberInfo } from 'util/memberInfo.decorator';
import { Member } from 'src/member/entities/member.entity';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post(':columnId')
  async create(
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    await this.cardService.create(createCardDto, +columnId);
  }

  @Get(':columnId')
  findAll(@Param('columnId') columnId: number) {
    return this.cardService.findAll(+columnId);
  }

  @Get(':columnId/:cardId')
  findOne(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    return this.cardService.findOne(+columnId, +cardId);
  }

  @Patch(':columnId/:cardId')
  update(
    @MemberInfo() member: Member,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardeDto: UpdateCardDto,
  ) {
    this.cardService.update(member.boardId, +columnId, +cardId, updateCardeDto);
  }

  @Delete(':columnId/:cardId')
  async delete(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    await this.cardService.delete(+columnId, +cardId);
  }
}
