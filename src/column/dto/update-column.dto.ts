
import { IsString } from 'class-validator';

export class UpdateColumnDto  {


    @IsString()
    columName: string;

    
}
