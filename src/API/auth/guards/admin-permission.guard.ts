import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminType } from 'src/domain/entities/admin.entity';

@Injectable()
export abstract class BaseAdminRoleGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    private readonly requiredRoles: AdminType[],
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
      const payload = this.jwtService.verify(token, { secret });
      
      request.admin = payload;

      // Ensure user is an admin
      if (payload.role?.toLowerCase() !== 'admin') {
         return false;
      }

      const userType = payload.type as AdminType;
      
      // Super Admin usually has access to everything, but here we strictly enforce roles unless specified otherwise.
      // If we want Super Admin to pass all guards, we can uncomment the next line:
      // if (userType === AdminType.SUPER_ADMIN) return true;

      if (!userType || !this.requiredRoles.includes(userType)) {
        throw new ForbiddenException(`Access restricted to ${this.requiredRoles.join(', ')}`);
      }

      return true;
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class SuperAdminGuard extends BaseAdminRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, [AdminType.SUPER_ADMIN]);
  }
}

@Injectable()
export class MedicalReviewerGuard extends BaseAdminRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, [AdminType.MEDICAL_REVIEWER, AdminType.SUPER_ADMIN]);
  }
}

@Injectable()
export class OperationsAdminGuard extends BaseAdminRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, [AdminType.OPERATIONS_ADMIN, AdminType.SUPER_ADMIN]);
  }
}

@Injectable()
export class VendorManagerGuard extends BaseAdminRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, [AdminType.VENDOR_MANAGER, AdminType.SUPER_ADMIN]);
  }
}

@Injectable()
export class FinanceAdminGuard extends BaseAdminRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, [AdminType.FINANCE_ADMIN, AdminType.SUPER_ADMIN]);
  }
}
