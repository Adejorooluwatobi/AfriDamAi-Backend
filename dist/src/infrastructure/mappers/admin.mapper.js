"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapper = void 0;
const admin_entity_1 = require("../../domain/entities/admin.entity");
const response_dto_1 = require("../../application/DTOs/response.dto");
class AdminMapper {
    static toDomain(raw) {
        const admin = new admin_entity_1.AdminEntity();
        admin.id = raw.id;
        admin.firstName = raw.firstName ?? undefined;
        admin.lastName = raw.lastName ?? undefined;
        admin.username = raw.username ?? '';
        admin.email = raw.email;
        admin.type = raw.type;
        admin.isActive = raw.isActive;
        admin.isSuspended = raw.isSuspended;
        admin.phoneNo = raw.phoneNo ?? '';
        admin.password = raw.password ?? '';
        admin.refreshToken = raw.refreshToken ?? undefined;
        admin.resetToken = raw.resetToken ?? undefined;
        admin.resetTokenExpiry = raw.resetTokenExpiry ?? undefined;
        admin.lastLoginAt = raw.lastLoginAt ?? undefined;
        admin.createdAt = raw.createdAt;
        admin.updatedAt = raw.updatedAt;
        admin.organizationId = raw.organizationId ?? undefined;
        return admin;
    }
    static toDomainArray(raws) {
        return raws.map(admin => this.toDomain(admin));
    }
    static toPersistence(domain) {
        return {
            email: domain.email,
            username: domain.username ?? null,
            firstName: domain.firstName ?? null,
            lastName: domain.lastName ?? null,
            type: domain.type,
            password: domain.password,
            isActive: domain.isActive,
            isSuspended: domain.isSuspended,
            phoneNo: domain.phoneNo ?? null,
            refreshToken: domain.refreshToken ?? null,
            resetToken: domain.resetToken ?? null,
            resetTokenExpiry: domain.resetTokenExpiry ?? null,
            lastLoginAt: domain.lastLoginAt ?? null,
            organizationId: domain.organizationId ?? null,
        };
    }
    static toSecureResponse(entity) {
        const response = new response_dto_1.SecureAdminResponseDto();
        response.id = entity.id;
        response.firstName = entity.firstName;
        response.lastName = entity.lastName;
        response.username = entity.username;
        response.email = entity.email;
        response.type = entity.type;
        response.isActive = entity.isActive;
        response.isSuspended = entity.isSuspended;
        response.lastLoginAt = entity.lastLoginAt;
        response.phoneNo = entity.phoneNo;
        response.createdAt = entity.createdAt;
        response.updatedAt = entity.updatedAt;
        return response;
    }
}
exports.AdminMapper = AdminMapper;
//# sourceMappingURL=admin.mapper.js.map