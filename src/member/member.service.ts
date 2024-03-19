import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async register(createMemberDto: CreateMemberDto) {
    const { email, password, memberName, contact } = createMemberDto;

    const existingMember = await this.findByEmail(email);
    if (existingMember) {
      throw new ConflictException(
        '이미 해당 이메일로 가입한 사용자가 있습니다.',
      );
    }

    const hashedPassword = await hash(password, 10);
    await this.memberRepository.save({
      email,
      password: hashedPassword,
      memberName,
      contact,
    });
  }

  //로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const member = await this.memberRepository.findOne({
      where: { email },
      select: ['memberId', 'email', 'password'],
    });

    if (_.isNil(member)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, member.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, memberId: member.memberId };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // findAll() {
  //   return `This action returns all member`;
  // }

  //아이디로 회원 정보 가져오기
  async findOneByMemberId(memberId: number) {
    return await this.memberRepository.findOneBy({ memberId });
  }

  //회원 정보 수정
  async updateMyInfo(memberId: number, updateMemberDto: UpdateMemberDto) {}

  //회원 탈퇴
  async withdraw(memberId: number, deleteMemberDto: DeleteMemberDto) {}

  //이메일로 회원정보 찾기(이메일 중복확인)
  async findByEmail(email: string) {
    return await this.memberRepository.findOneBy({ email });
  }
}
