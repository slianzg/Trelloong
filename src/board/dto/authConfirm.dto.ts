import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AuthConfirmDto {
    @IsEmail()
    @IsNotEmpty({ message : '이메일을 입력하세요.' })
    @ApiProperty({ example: 'aaaa1234@gmail.com', description: '이메일' })
    email : string
    
    @IsNumber()
    @IsNotEmpty({ message : '인증번호를 입력하세요.' })
    @ApiProperty({ example: 1234, description: '인증 토큰이라우' })
    verificationToken : number
}