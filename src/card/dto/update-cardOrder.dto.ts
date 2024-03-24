import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCardOrderDto {
  @IsNumber()
  @IsOptional()
  inputColumn: number;

  @IsNumber()
  @IsOptional()
  inputOrder: number;
}
