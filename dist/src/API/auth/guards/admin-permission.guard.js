"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceAdminGuard = exports.VendorManagerGuard = exports.OperationsAdminGuard = exports.MedicalReviewerGuard = exports.SuperAdminGuard = exports.BaseAdminRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admin_entity_1 = require("../../../domain/entities/admin.entity");
let BaseAdminRoleGuard = class BaseAdminRoleGuard {
    constructor(jwtService, configService, requiredRoles) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.requiredRoles = requiredRoles;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
            const payload = this.jwtService.verify(token, { secret });
            request.admin = payload;
            if (payload.role?.toLowerCase() !== 'admin') {
                return false;
            }
            const userType = payload.type;
            if (!userType || !this.requiredRoles.includes(userType)) {
                throw new common_1.ForbiddenException(`Access restricted to ${this.requiredRoles.join(', ')}`);
            }
            return true;
        }
        catch (e) {
            if (e instanceof common_1.ForbiddenException)
                throw e;
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.BaseAdminRoleGuard = BaseAdminRoleGuard;
exports.BaseAdminRoleGuard = BaseAdminRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService, Array])
], BaseAdminRoleGuard);
let SuperAdminGuard = class SuperAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService, configService) {
        super(jwtService, configService, [admin_entity_1.AdminType.SUPER_ADMIN]);
    }
};
exports.SuperAdminGuard = SuperAdminGuard;
exports.SuperAdminGuard = SuperAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], SuperAdminGuard);
let MedicalReviewerGuard = class MedicalReviewerGuard extends BaseAdminRoleGuard {
    constructor(jwtService, configService) {
        super(jwtService, configService, [admin_entity_1.AdminType.MEDICAL_REVIEWER, admin_entity_1.AdminType.SUPER_ADMIN]);
    }
};
exports.MedicalReviewerGuard = MedicalReviewerGuard;
exports.MedicalReviewerGuard = MedicalReviewerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], MedicalReviewerGuard);
let OperationsAdminGuard = class OperationsAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService, configService) {
        super(jwtService, configService, [admin_entity_1.AdminType.OPERATIONS_ADMIN, admin_entity_1.AdminType.SUPER_ADMIN]);
    }
};
exports.OperationsAdminGuard = OperationsAdminGuard;
exports.OperationsAdminGuard = OperationsAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], OperationsAdminGuard);
let VendorManagerGuard = class VendorManagerGuard extends BaseAdminRoleGuard {
    constructor(jwtService, configService) {
        super(jwtService, configService, [admin_entity_1.AdminType.VENDOR_MANAGER, admin_entity_1.AdminType.SUPER_ADMIN]);
    }
};
exports.VendorManagerGuard = VendorManagerGuard;
exports.VendorManagerGuard = VendorManagerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], VendorManagerGuard);
let FinanceAdminGuard = class FinanceAdminGuard extends BaseAdminRoleGuard {
    constructor(jwtService, configService) {
        super(jwtService, configService, [admin_entity_1.AdminType.FINANCE_ADMIN, admin_entity_1.AdminType.SUPER_ADMIN]);
    }
};
exports.FinanceAdminGuard = FinanceAdminGuard;
exports.FinanceAdminGuard = FinanceAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], FinanceAdminGuard);
//# sourceMappingURL=admin-permission.guard.js.map