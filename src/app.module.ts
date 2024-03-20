import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MemberModule } from './member/member.module';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { GroupModule } from './group/group.module';
import Joi from 'joi';
import { Member } from './member/entities/member.entity';
import { Board } from './board/entities/board.entity';
import { Columns } from './column/entities/column.entity';
import { Card } from './card/entities/card.entity';
import { Group } from './group/entities/group.entity';
import { Comment } from './comment/entities/comment.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [Member, Board, Columns, Card, Comment, Group],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
