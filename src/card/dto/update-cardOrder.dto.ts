import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCardOrderDto {
  @IsNumber()
  @IsOptional()
  inputColumn: number;

  @IsNumber()
  @IsOptional()
  inputOrder: number;
}
