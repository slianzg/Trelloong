
import { IsInt, IsNotEmpty, IsString } from 'class-validator';


export class UpdateColumnOrderDto {

   
    @IsInt()
    @IsNotEmpty({ message: '순서를 입력해 주세요' })
    columnOrder: number;

    
  }
