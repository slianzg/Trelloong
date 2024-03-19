import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { LoginDto } from './dto/login.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  //회원가입
  @Post('register')
  async register(@Body() createMemberDto: CreateMemberDto, @Res() res) {
    const { password, confirmPassword } = createMemberDto;
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호와 비밀번호확인이 다릅니다.');
    }

    await this.memberService.register(createMemberDto);
    res.send('회원가입되었습니다. 로그인해주세요!');
  }

  //로그인
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const token = await this.memberService.login(loginDto);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.send('로그인되었습니다.');
  }

  //내 정보 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('myPage')
  async getMyInfo(@Req() req) {
    const { memberId } = req.user;
    return await this.memberService.findOneByMemberId(memberId);
  }

  //내 정보 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch('myPage/updateInfo')
  async updateMyInfo(
    @Req() req,
    @Body() updateMemberDto: UpdateMemberDto,
    @Res() res,
  ) {
    const { memberId } = req.user;
    await this.memberService.updateMyInfo(memberId, updateMemberDto);
    res.send('회원정보 수정이 완료되었습니다.');
  }

  //회원 탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('withdraw')
  async withdraw(
    @Req() req,
    @Body() deleteMemberDto: DeleteMemberDto,
    @Res() res,
  ) {
    const { memberId } = req.user;
    await this.memberService.withdraw(memberId, deleteMemberDto);
    res.send('회원 탈퇴되었습니다.');
  }
}
