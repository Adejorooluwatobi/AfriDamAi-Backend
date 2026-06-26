import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminType } from '@prisma/client';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<AdminType[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.type) {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    const hasRole = requiredRoles.includes(user.type);
    
    if (!hasRole) {
      throw new ForbiddenException(`Access denied: Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
