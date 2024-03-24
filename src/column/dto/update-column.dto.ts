import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '입력해주세요' })
  @ApiProperty({ example: '칼럼 후드', description: '칼럼 이름' })
  columnName: string;
}
