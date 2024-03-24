import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // memberGuard에서 사용
  async findMember(boardId: number, userId: number) {
    return await this.memberRepository.findOne({ where: { boardId, userId } });
  }

  async compare(boardId: number, assignedTo: number) {
    const member = await this.memberRepository.findOne({
      where: { boardId: +boardId, userId: +assignedTo },
    });
    if (_.isNil(member)) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
  }
}
