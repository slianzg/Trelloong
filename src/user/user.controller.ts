import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //회원가입
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    const { password, confirmPassword } = createUserDto;
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호와 비밀번호확인이 다릅니다.');
    }

    await this.userService.register(createUserDto);
    res.send('회원가입되었습니다. 로그인해주세요!');
  }

  //로그인
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const token = await this.userService.login(loginDto);
    res.cookie('authorization', `Bearer ${token.accessToken}`);
    res.send('로그인되었습니다.');
  }

  //내 정보 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('myPage')
  async getMyInfo(@Req() req) {
    const { userId } = req.user;
    return await this.userService.findOneByUserId(userId);
  }

  //내 정보 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch('myPage/update')
  async updateMyInfo(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    const { userId } = req.user;
    await this.userService.updateMyInfo(userId, updateUserDto);
    res.send('회원정보 수정이 완료되었습니다.');
  }

  //회원 탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('myPage/withdraw')
  async withdraw(@Req() req, @Body() deleteUserDto: DeleteUserDto, @Res() res) {
    const { userId } = req.user;
    const deletedUser = await this.userService.withdraw(userId, deleteUserDto);
    return res.status(deletedUser.status).send(`${deletedUser.message}`);
  }
}
