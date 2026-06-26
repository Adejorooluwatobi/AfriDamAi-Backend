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
exports.SpecialistOrAdminGuard = exports.SpecialistGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
let SpecialistGuard = class SpecialistGuard {
    constructor(reflector, jwtService, configService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            return false;
        }
        try {
            const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
            const payload = this.jwtService.verify(token, { secret });
            request.specialist = payload;
            return payload.role === 'specialist';
        }
        catch {
            return false;
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.SpecialistGuard = SpecialistGuard;
exports.SpecialistGuard = SpecialistGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        config_1.ConfigService])
], SpecialistGuard);
let SpecialistOrAdminGuard = class SpecialistOrAdminGuard {
    constructor(reflector, jwtService, configService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            return false;
        }
        try {
            const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
            const payload = this.jwtService.verify(token, { secret });
            if (payload.role === 'admin') {
                request.admin = payload;
            }
            else {
                request.specialist = payload;
            }
            return payload.role === 'specialist' || payload.role === 'admin';
        }
        catch {
            return false;
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.SpecialistOrAdminGuard = SpecialistOrAdminGuard;
exports.SpecialistOrAdminGuard = SpecialistOrAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        config_1.ConfigService])
], SpecialistOrAdminGuard);
//# sourceMappingURL=special.guard.js.map