import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminType } from 'src/domain/entities/admin.entity';
export declare abstract class BaseAdminRoleGuard implements CanActivate {
    protected readonly jwtService: JwtService;
    protected readonly configService: ConfigService;
    private readonly requiredRoles;
    constructor(jwtService: JwtService, configService: ConfigService, requiredRoles: AdminType[]);
    canActivate(context: ExecutionContext): boolean;
    private extractTokenFromHeader;
}
export declare class SuperAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService: JwtService, configService: ConfigService);
}
export declare class MedicalReviewerGuard extends BaseAdminRoleGuard {
    constructor(jwtService: JwtService, configService: ConfigService);
}
export declare class OperationsAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService: JwtService, configService: ConfigService);
}
export declare class VendorManagerGuard extends BaseAdminRoleGuard {
    constructor(jwtService: JwtService, configService: ConfigService);
}
export declare class FinanceAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService: JwtService, configService: ConfigService);
}
