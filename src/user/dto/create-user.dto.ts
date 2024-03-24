import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  confirmPassword: string;

  @IsString()
  @MinLength(1)
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  userName: string;

  // @IsPhoneNumber('KR')
  @Matches(/^01[0-9]-\d{3,4}-\d{4}$/, {
    message: '휴대폰 번호 방식에 맞게 작성해주세요.',
  })
  @IsOptional()
  contact: string;
}
