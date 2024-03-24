import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/createBoard.dto';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { Member } from 'src/member/entities/member.entity';
import { DeleteBoardDto } from './dto/deleteBoard.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/utils/sendEmail.service';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { Role } from 'src/types/role.type';
import { AuthConfirmDto } from './dto/authConfirm.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private sendEmailService: SendEmailService,
    private readonly dataSource: DataSource,
  ) {}

  // 보드 생성
  async createBoard(createBoardDto: CreateBoardDto, userId: number) {
    const { boardName, boardDescription, boardColor } = createBoardDto
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const boardInfo = await queryRunner.manager.getRepository(Board).save({
      boardName,
      boardDescription,
      boardColor,
      userId,
    });
    await queryRunner.manager.getRepository(Member).save({
      userId,
      boardId: boardInfo.boardId,
      role: Role.Admin,
      verificationToken: null,
    });
      await queryRunner.commitTransaction();
      return boardInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 보드 수정
  async updatedBoard(
    boardId: number,
    updatedBoardDto: UpdatedBoardDto,
    userId: number,
  ) {
    const { boardName, boardDescription, boardColor } = updatedBoardDto;

    // 3칸 다 비어 있을 경우
    if (!boardName && !boardDescription && !boardColor) {
      throw new BadRequestException('수정사항이 없습니다.');
    }

    // 보드 존재 여부
    const findBoard = await this.boardRepository.findOne({
      where: {
        boardId: +boardId,
      },
    });
    if (!findBoard) {
      throw new NotFoundException('수정하려는 보드가 존재하지 않습니다.');
    }

    await this.boardRepository.update(boardId, {
      boardName,
      boardDescription,
      boardColor,
    });
  }

  // 보드 삭제
  async deleteBoard(
    userEmail: string,
    boardId: number,
    deleteBoardDto: DeleteBoardDto,
  ) {
    if (!boardId) {
      throw new NotFoundException('삭제 하려는 보드가 존재하지 않습니다.');
    }

    // 삭제하기 위한 비밀번호 검증
    const savedPassword = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
      select: {
        password: true,
      },
    });

    if (
      !(await bcrypt.compare(deleteBoardDto.password, savedPassword.password))
    ) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }
    this.boardRepository.delete({
      boardId: boardId,
    });
  }

  // 보드 목록
  async boardList(userId: number) {
    const boardListUp = await this.memberRepository.find({
      where: {
        userId,
        role: In([Role.Admin, Role.Member]),
      },
      select: {
        memberId: true,
        role: true,
        board: {
          boardId: true,
          boardName: true,
          boardDescription: true,
        },
      },
      relations: ['board'],
    });
    return boardListUp;
  }

  // 멤버 초대
  async inviteMember(
    boardId: number,
    inviteBoardDto: InviteBoardDto,
    userId: number,
  ) {
    // 초대할 유저 유무 확인
    const inviteUser = await this.userRepository.findOne({
      where: {
        email: inviteBoardDto.email,
      },
      select: {
        userId: true,
        email: true,
      },
    });
    if (!inviteUser) {
      throw new NotFoundException('초대하려는 유저가 존재하지 않습니다.');
    }
    // 초대할 유저가 해당 보드에 요청 받았던 전적이 있는지 확인
    const savedMember = await this.memberRepository.findOne({
      where: {
        boardId,
        userId: inviteUser.userId,
      },
    });
    if (savedMember) {
      throw new NotAcceptableException(
        '같은 사용자에게 여러번 초대를 보낼 수 없습니다.',
      );
    }
    if (!savedMember) {
      const randomNum = () => {
        // 랜덤한 숫자로 구성된 토큰 생성
        return Math.floor(1000 + Math.random() * 9000);
      };
      const token = randomNum();

      await this.memberRepository.save({
        userId: inviteUser.userId,
        boardId: boardId,
        role: Role.User, // 초대 대기 상태
        verificationToken: token,
      });

      await this.sendEmailService.sendInvitationEmail(inviteUser.email, token);
    }
  }

  // 인증 확인
  async confirmToken(authConfirmDto: AuthConfirmDto, userId: number) {
    const halfMember = await this.userRepository.findOne({
      where: {
        email: authConfirmDto.email,
        userId,
      },
      select: {
        userId: true,
      },
    });

    // 대리 인증 방지
    if (!halfMember) {
      throw new ConflictException(
        '존재 하지 않는 이메일이거나 본인만 인증이 가능합니다.',
      );
    }

    const member = await this.memberRepository.findOne({
      where: {
        userId: halfMember.userId,
        verificationToken: authConfirmDto.verificationToken,
      },
    });

    if (!member) {
      throw new ConflictException('인증번호가 일치하지 않습니다.');
    }
    await this.memberRepository.update(member.memberId, {
      role: Role.Member,
    });
  }
}
