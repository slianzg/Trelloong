import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemberService } from 'src/member/member.service';
import { Role } from 'src/types/role.type';

@Injectable()
export class MemberGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly memberService: MemberService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();

    const boardId = request.params.boardId;
    //MemberService 주입 대기
    // while (!this.memberService) {
    // await new Promise(resolve => setTimeout(resolve, 100));
    // }
    console.log(this.memberService)
    const member = await this.memberService.findMember(boardId, user.userId);
    
    if (!member || member.role === Role.User) {
      return false;
    }

    return true;
  }
}
