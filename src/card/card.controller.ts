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

@UseGuards(MemberGuard)
@Controller('column/:columnId/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  async create(
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    await this.cardService.create(createCardDto, +columnId);
  }

  @Get('cardList')
  findAll(@Param('columnId') columnId: number) {
    return this.cardService.findAll(+columnId);
  }

  @Get('cardInfo/:cardId')
  findOne(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    return this.cardService.findOne(+columnId, +cardId);
  }

  @Patch('update/:cardId')
  cardUpdate(
    @MemberInfo() member: Member,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardeDto: UpdateCardDto,
  ) {
    this.cardService.cardUpdate(
      member.boardId,
      +columnId,
      +cardId,
      updateCardeDto,
    );
  }

  @Delete('delete/:cardId')
  async delete(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    await this.cardService.delete(+columnId, +cardId);
  }
}
