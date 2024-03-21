import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty({ message : '보드 이름을 입력해주세요.'})
    @Length(2, 100, {message : "보드 이름은 2글자 이상 입력해주세요"})
    name : string

    @IsString()
    @IsNotEmpty({ message : '보드 설명을 작성해주세요.' })
    @Length(2, 300, {message : "보드 설명은 2글자 이상 입력해주세요"})
    description : string

    @IsString()
    @IsOptional()
    color : string
}