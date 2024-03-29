import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

const ROLES_MAAPING_REVERSE = {
  [Role.Student]: 1,
  [Role.Teacher]: 2,
  [Role.Admin]: 3,
  [Role.Guest]: 4,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector
      .getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
      .map((item) => ROLES_MAAPING_REVERSE[item]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [type, accessToken] = request.headers.authorization.split(' ');

    const token = this.jwtService.verify(accessToken);
    const role = token.roleId;
    if (!role) throw new ForbiddenException();

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException();
    } else {
      return true;
    }
  }
}
