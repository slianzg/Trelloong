import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateColumnDto  {


    @IsString()
    @IsNotEmpty({message:'입력해주세요'})
    columnName: string;

    
}
