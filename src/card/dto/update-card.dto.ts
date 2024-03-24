import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '국민카드', description: '카드 이름' })
  cardName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '카드 설명이랄까', description: '카드 설명' })
  cardDescription: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Yellow', description: '카드 색깔' })
  cardColor: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: '작업자 아이디' })
  assignedTo: number;
}
