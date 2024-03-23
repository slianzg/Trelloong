import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemberService } from 'src/member/member.service';
import { Role } from 'src/types/role.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MemberGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly memberService: MemberService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();

    let boardId = request.params.boardId;
    const member = await this.memberService.findMember(+boardId, user.userId);

    if (!member || member.role === Role.User) {
      return false;
    }
    return true;
  }
}
