import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
