import { IsInt, IsNotEmpty, IsString } from 'class-validator';


export class CreateColumnDto {
    @IsString()
    @IsNotEmpty({ message: '이름을 입력해주세요' })
    columName: string;
  
   
    @IsInt()
    @IsNotEmpty({ message: '순서를 입력해 주세요' })
    columnOrder: number;

    @IsInt()
    @IsNotEmpty({ message: '보드를 입력해주세요' })
    boardId: number;
  }