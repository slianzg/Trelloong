import { Module } from '@nestjs/common';
import { GroupService } from './group.service';

@Module({
  controllers: [],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
