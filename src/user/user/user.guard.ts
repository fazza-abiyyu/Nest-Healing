import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from './user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    const roleHierarchy = {
      USER: 1,
      ADMIN: 2,
    };

    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = Math.min(
      ...requiredRoles.map((role) => roleHierarchy[role]),
    );

    return userRoleLevel >= requiredRoleLevel;
  }
}
