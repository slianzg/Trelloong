import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll() {
    return `This action returns all group`;
  }

  async compare(groupId: number, assignedTo: number[]) {
    for (let Id in assignedTo) {
      const member = await this.groupRepository.findOne({
        where: { groupId, memberId: +Id },
      });
      if (_.isNil(member)) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
