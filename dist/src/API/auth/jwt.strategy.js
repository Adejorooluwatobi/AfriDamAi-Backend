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
exports.JwtAuthGuard = exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const passport_2 = require("@nestjs/passport");
const vendor_service_1 = require("../../domain/services/vendor.service");
const user_service_1 = require("../../domain/services/user.service");
const admin_service_1 = require("../../domain/services/admin.service");
const specialist_service_1 = require("../../domain/services/specialist.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService, vendorService, userService, adminService, specialistService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production',
        });
        this.configService = configService;
        this.vendorService = vendorService;
        this.userService = userService;
        this.adminService = adminService;
        this.specialistService = specialistService;
    }
    async validate(payload) {
        let user;
        if (payload.role === 'vendor') {
            user = await this.vendorService.findOneVendor(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Vendor not found');
            }
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                type: 'vendor',
                vendor: { id: user.vendor.id, companyName: user.vendor.companyName, isActive: user.vendor.isActive },
            };
        }
        else if (payload.role === 'user') {
            user = await this.userService.findOneUser(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                type: 'user',
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: user.isActive,
                    onboardingCompleted: user.onboardingCompleted,
                    plan: user.plan || {
                        id: 'default-free',
                        name: 'Free Tier',
                        type: 'FREE',
                        price: 0,
                        description: ['Basic access'],
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                },
            };
        }
        else if (payload.role === 'specialist') {
            user = await this.specialistService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Specialist not found');
            }
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                type: 'specialist',
                specialist: { id: user.specialist.id, firstName: user.specialist.firstName, lastName: user.specialist.lastName, isActive: user.specialist.isActive },
            };
        }
        else if (payload.role === 'admin') {
            user = await this.adminService.findOneAdmin(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Admin not found');
            }
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                type: user.type,
                admin: { id: user.id, username: user.username, isActive: user.isActive, type: user.type },
            };
        }
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        vendor_service_1.VendorService,
        user_service_1.UserService,
        admin_service_1.AdminService,
        specialist_service_1.SpecialistService])
], JwtStrategy);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_2.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt.strategy.js.map