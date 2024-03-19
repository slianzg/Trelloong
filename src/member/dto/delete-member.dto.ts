import { PickType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class DeleteMemberDto extends PickType(CreateMemberDto, [
  'password',
] as const) {}
