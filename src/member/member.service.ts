import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
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

  create(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
  }

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async compare(boardId: number, assignedTo: number[]) {
    for (let Id in assignedTo) {
      const member = await this.memberRepository.findOne({
        where: { boardId: +boardId, memberId: +Id },
      });
      if (_.isNil(member)) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
    }
  }

  async findMember(boardId: number, userId: number) {
    return await this.memberRepository.findOne({ where: { boardId, userId } });
  }
}
