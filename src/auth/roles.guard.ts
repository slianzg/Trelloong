import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/types/role.type";


// 인가의 완성, 가드.
@Injectable()
// AuthGuard('jwt') : jwt인증이 된 상황에서(로그인한 상태), Role을 볼 것이다.
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  // canActivate : true면 통과, false면 
  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }
    // reflector를 통해 'roles'안에 Role타입을 가져온다.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }   // 아니 role이 없는데 왜 true로 넘기지..?

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}