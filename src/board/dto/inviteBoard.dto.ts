import { IsEmail, IsNotEmpty } from "class-validator";

export class InviteBoardDto {
    @IsEmail()
    @IsNotEmpty({ message: '초대할 사용자의 이메일을 입력해주세요.' })
    email: string;
  }