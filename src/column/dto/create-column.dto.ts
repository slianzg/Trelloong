import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @ApiProperty({ example: '컬럼 후드', description: '컬럼 이름' })
  columnName: string;
}
