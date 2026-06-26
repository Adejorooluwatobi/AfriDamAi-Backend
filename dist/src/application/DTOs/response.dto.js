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
exports.SecureSpecialistResponseDto = exports.SecureVendorResponseDto = exports.SecureAdminResponseDto = exports.SecureUserResponseDto = exports.ErrorResponseDto = exports.PaginatedResponseDto = exports.UserResponseDto = exports.ApiResponseDto = void 0;
const profile_entity_1 = require("../../domain/entities/profile.entity");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const subscription_entity_1 = require("../../domain/entities/subscription.entity");
const analyzer_entity_1 = require("../../domain/entities/analyzer.entity");
class ApiResponseDto {
    constructor(data, message, statusCode = 200) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ApiResponseDto = ApiResponseDto;
class UserResponseDto {
    constructor(id, email, role, isVerified, onboardingCompleted = false) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.isVerified = isVerified;
        this.onboardingCompleted = onboardingCompleted;
    }
}
exports.UserResponseDto = UserResponseDto;
class PaginatedResponseDto {
    constructor(items, total, page, pageSize) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
class ErrorResponseDto {
    constructor(error, message, statusCode = 400) {
        this.error = error;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ErrorResponseDto = ErrorResponseDto;
class SecureUserResponseDto {
}
exports.SecureUserResponseDto = SecureUserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "sex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureUserResponseDto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureUserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureUserResponseDto.prototype, "isSuspended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Date)
], SecureUserResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureUserResponseDto.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => profile_entity_1.ProfileEntity, nullable: true }),
    __metadata("design:type", profile_entity_1.ProfileEntity)
], SecureUserResponseDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => subscription_entity_1.UserSubscriptionEntity, nullable: true }),
    __metadata("design:type", subscription_entity_1.UserSubscriptionEntity)
], SecureUserResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], SecureUserResponseDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [analyzer_entity_1.AnalyzerEntity], nullable: true }),
    __metadata("design:type", Array)
], SecureUserResponseDto.prototype, "analyzers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureUserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureUserResponseDto.prototype, "updatedAt", void 0);
class SecureAdminResponseDto {
}
exports.SecureAdminResponseDto = SecureAdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureAdminResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureAdminResponseDto.prototype, "isSuspended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Date)
], SecureAdminResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureAdminResponseDto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureAdminResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureAdminResponseDto.prototype, "updatedAt", void 0);
const wallet_entity_1 = require("../../domain/entities/wallet.entity");
class SecureVendorResponseDto {
}
exports.SecureVendorResponseDto = SecureVendorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "rcNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "businessAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], SecureVendorResponseDto.prototype, "documentsUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureVendorResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureVendorResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureVendorResponseDto.prototype, "isSuspended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Date)
], SecureVendorResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureVendorResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureVendorResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => wallet_entity_1.Wallet, nullable: true, description: 'Vendor Wallet information' }),
    __metadata("design:type", wallet_entity_1.Wallet)
], SecureVendorResponseDto.prototype, "wallet", void 0);
class SecureSpecialistResponseDto {
}
exports.SecureSpecialistResponseDto = SecureSpecialistResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "sex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], SecureSpecialistResponseDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SpecialistType }),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SpecialistStatus }),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureSpecialistResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SecureSpecialistResponseDto.prototype, "isSuspended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Date)
], SecureSpecialistResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of completed appointments' }),
    __metadata("design:type", Number)
], SecureSpecialistResponseDto.prototype, "completedAppointments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureSpecialistResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SecureSpecialistResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SecureSpecialistResponseDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => wallet_entity_1.Wallet, nullable: true, description: 'Specialist Wallet information' }),
    __metadata("design:type", wallet_entity_1.Wallet)
], SecureSpecialistResponseDto.prototype, "wallet", void 0);
//# sourceMappingURL=response.dto.js.map