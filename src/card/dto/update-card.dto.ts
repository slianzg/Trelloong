import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateCardDto {
  @IsString()
  cardName: string;

  @IsString()
  cardDescription: string;

  @IsString()
  cardColor: string;

  @IsString()
  @IsUrl()
  cardImage: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  assignedTo: number[];
}
