import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AuthConfirmDto {
    @IsEmail()
    @IsNotEmpty({ message : '이메일을 입력하세요.' })
    email : string
    
    @IsNumber()
    @IsNotEmpty({ message : '인증번호를 입력하세요.' })
    verificationToken : number
}