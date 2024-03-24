import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['userName', 'contact']),
) {
  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @ApiProperty({ example: 'aaaa1234', description: '비밀번호' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: '팜하니', description: '유저이름' })
  userName?: string;

  @IsOptional()
  @ApiProperty({ example: '010-1234-4321', description: '전화번호' })
  contact?: string;
}
