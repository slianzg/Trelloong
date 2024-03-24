import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdatedBoardDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: '스케이트 보드', description: '보드 이름' })
    boardName : string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '조금 크고 나니 안 타던 스케이트 보드', description: '보드 설명' })
    boardDescription : string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Red', description: '보드색깔' })
    boardColor : string
}