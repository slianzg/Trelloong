import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  //회원가입
  async register(createUserDto: CreateUserDto) {
    const { email, password, userName, contact } = createUserDto;

    const existinguser = await this.findByEmail(email);
    if (existinguser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입한 사용자가 있습니다.',
      );
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      userName,
      contact,
    });
  }

  //로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['userId', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, userId: user.userId };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  //아이디로 회원 정보 가져오기
  async findOneByUserId(userId: number) {
    return await this.userRepository.findOneBy({ userId });
  }

  //회원 정보 수정
  async updateMyInfo(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId },
      select: ['password'],
    });

    const { password, userName, contact } = updateUserDto;

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    if (!userName && !contact) {
      throw new BadRequestException('수정할 값을 입력해주세요.');
    }

    await this.userRepository.update(userId, { userName, contact });
  }

  //회원 탈퇴
  async withdraw(userId: number, deleteUserDto: DeleteUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId },
      select: ['email', 'password'],
    });

    const { password } = deleteUserDto;

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deletedUserEmail = `${user.email}_deleted_${Date.now()}`;
      await queryRunner.manager.update(User, userId, {
        email: deletedUserEmail,
      }); //삭제하려는 유저 이메일 변경
      await queryRunner.manager.softDelete(User, { userId });
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        status: 200,
        message: '정상적으로 회원탈퇴 되었습니다.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return { status: err.status, message: err };
    }
  }

  //이메일로 회원정보 찾기(이메일 중복확인+jwtStrategy에서 사용)
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
