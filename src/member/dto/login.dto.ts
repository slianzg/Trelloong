import { PickType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class LoginDto extends PickType(CreateMemberDto, [
  'email',
  'password',
] as const) {}
