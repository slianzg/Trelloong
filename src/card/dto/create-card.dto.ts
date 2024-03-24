import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: '카드 이름을 입력해주세요' })
  @ApiProperty({ example: '유희왕 카드', description: '카드 이름' })
  cardName: string;
}
