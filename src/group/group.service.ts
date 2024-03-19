import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
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

  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group';
  }

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

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
