import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  columnName: string;
}
