import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCardOrderDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, description: '이동할 컬럼' })
  inputColumn: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 5, description: '이동할 순서' })
  inputOrder: number;
}
