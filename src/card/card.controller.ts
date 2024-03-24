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
import { Member } from 'src/member/entities/member.entity';
import { MemberGuard } from 'src/auth/member.guard';
import { UpdateCardOrderDto } from './dto/update-cardOrder.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('CARD')
@UseGuards(MemberGuard)
@Controller('board/:boardId/column/:columnsId/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // 카드 생성
  @ApiOperation({ summary: '카드 생성' })
  @Post('create')
  async create(
    @Param('columnsId') columnsId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    await this.cardService.create(createCardDto, +columnsId);
    return { message: '카드가 생성되었습니다.' };
  }

  // 카드 정보 수정
  @ApiOperation({ summary: '카드 정보 수정' })
  @Patch('update/:cardId')
  async cardUpdate(
    @Param('boardId') boardId: Member,
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardeDto: UpdateCardDto,
  ) {
    await this.cardService.cardUpdate(
      +boardId,
      +columnsId,
      +cardId,
      updateCardeDto,
    );
    return { message: '카드가 수정되었습니다.' };
  }

  // 카드 목록 조회
  @ApiOperation({ summary: '카드 목록 조회' })
  @Get('cardList')
  async findAll(@Param('columnsId') columnId: number) {
    return await this.cardService.findAll(+columnId);
  }

  // 카드 상세 조회
  @ApiOperation({ summary: '카드 상세 조회' })
  @Get('cardInfo/:cardId')
  async findOne(
    @Param('columnsId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    return await this.cardService.findOne(+columnId, +cardId);
  }

  // 카드 삭제
  @ApiOperation({ summary: '카드 삭제' })
  @Delete('delete/:cardId')
  async delete(
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
  ) {
    await this.cardService.delete(+columnsId, +cardId);
    return { message: '카드가 삭제되었습니다.' };
  }

  // 카드 순서 & 컬럼 변경
  @ApiOperation({ summary: '카드 순서 & 컬럼 변경' })
  @Patch('orderUpdate/:cardId')
  async updateCardOrder(
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardOrderDto: UpdateCardOrderDto,
  ) {
    await this.cardService.updateCardOrder(
      +cardId,
      +columnsId,
      updateCardOrderDto,
    );
    return { message: '카드의 순서가 수정되었습니다.' };
  }

  // 카드 마감일 설정
  @ApiOperation({ summary: '카드 마감일 설정' })
  @Post('setDueDate/:cardId')
  async setDueDate(
    @Param('columnsId') columnsId: number,
    @Param('cardId') cardId: number,
    @Body('dueDate') dueDate: Date,
  ) {
    try {
      return await this.cardService.setDueDate(columnsId, cardId, dueDate);
    } catch (err) {
      return { message: `${err}` };
    }
  }
}
