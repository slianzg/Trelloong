import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/types/role.type';

// 핵심 인가 기능 생성
// Roles : 데코레이터 이름
// ...roles: Role[] 여러개의 롤(타입)을 받을 수 있다.
// 메타데이터는 'roles'라는 키에 저장이 된다.
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
console.log(Roles)