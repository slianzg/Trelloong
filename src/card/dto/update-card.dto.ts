import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  cardName: string;

  @IsString()
  @IsOptional()
  cardDescription: string;

  @IsString()
  @IsOptional()
  cardColor: string;

  @IsNumber()
  @IsOptional()
  assignedTo: number;
}
