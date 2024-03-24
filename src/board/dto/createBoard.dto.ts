import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty({ message : '보드 이름을 입력해주세요.'})
    @Length(2, 100, {message : "보드 이름은 2글자 이상 입력해주세요"})
    @ApiProperty({ example: '서린님이 시킨 스웨거', description: '보드 이름' })
    boardName : string

    @IsString()
    @IsNotEmpty({ message : '보드 설명을 작성해주세요.' })
    @Length(2, 300, {message : "보드 설명은 2글자 이상 입력해주세요"})
    @ApiProperty({ example: '보드 설명은 이러쿵 저러쿵', description: '보드 설명' })
    boardDescription : string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Blue', description: '보드 색깔' })
    boardColor : string
}