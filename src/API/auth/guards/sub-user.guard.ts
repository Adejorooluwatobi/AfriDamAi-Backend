import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SubUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'user') {
      return true; // Admins/Vendors might have different access patterns or bypass this
    }

    const plan = user.user?.plan;

    if (!plan || plan.type === 'FREE') {
      throw new ForbiddenException('Please subscribe to a paid plan to access this feature.');
    }

    return true;
  }
}
