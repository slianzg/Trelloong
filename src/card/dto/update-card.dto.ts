import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  assignedTo: number[];
}
