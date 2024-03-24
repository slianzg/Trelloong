import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: '카드 이름을 입력해주세요' })
  cardName: string;
}
