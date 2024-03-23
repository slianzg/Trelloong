import { IsOptional, IsString } from "class-validator";

export class UpdatedBoardDto {
    @IsString()
    @IsOptional()
    boardName : string

    @IsString()
    @IsOptional()
    boardDescription : string

    @IsString()
    @IsOptional()
    boardColor : string
}