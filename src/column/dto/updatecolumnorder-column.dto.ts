import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateColumnOrderDto {
  @IsInt()
  @IsNotEmpty({ message: '순서를 입력해 주세요' })
  @ApiProperty({ example: 7, description: '컬럼 순서' })
  columnOrder: number;
}
