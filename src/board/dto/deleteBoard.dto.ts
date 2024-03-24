import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteBoardDto {
    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @ApiProperty({ example: 'aaaa1234@gmail.com', description: '비밀번호' })
    password: string;
  }