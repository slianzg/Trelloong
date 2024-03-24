import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['userName', 'contact']),
) {
  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsOptional()
  userName?: string;

  @IsOptional()
  contact?: string;
}
