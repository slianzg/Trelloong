import { IsString } from "class-validator";

export class UpdatedBoardDto {
    @IsString()
    name : string

    @IsString()
    description : string

    @IsString()
    color : string
}