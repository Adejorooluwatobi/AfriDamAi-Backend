"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorMapper = void 0;
const vendor_entity_1 = require("../../domain/entities/vendor.entity");
class VendorMapper {
    static toDomain(raw) {
        return new vendor_entity_1.VendorEntity({
            id: raw.id,
            companyName: raw.companyName,
            rcNumber: raw.rcNumber,
            businessAddress: raw.businessAddress,
            phoneNumber: raw.phoneNumber,
            email: raw.email,
            documentsUrl: raw.documentsUrl ?? [],
            status: raw.status,
            isActive: raw.isActive,
            isSuspended: raw.isSuspended,
            password: raw.password ?? undefined,
            refreshToken: raw.refreshToken ?? undefined,
            resetToken: raw.resetToken ?? undefined,
            resetTokenExpiry: raw.resetTokenExpiry ?? undefined,
            lastLoginAt: raw.lastLoginAt ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map(vendor => this.toDomain(vendor));
    }
    static toPersistence(domain) {
        return {
            email: domain.email,
            companyName: domain.companyName,
            rcNumber: domain.rcNumber,
            businessAddress: domain.businessAddress,
            phoneNumber: domain.phoneNumber,
            documentsUrl: domain.documentsUrl ?? [],
            status: domain.status,
            password: domain.password || null,
            isActive: domain.isActive,
            isSuspended: domain.isSuspended,
            refreshToken: domain.refreshToken ?? null,
            resetToken: domain.resetToken ?? null,
            resetTokenExpiry: domain.resetTokenExpiry ?? null,
            lastLoginAt: domain.lastLoginAt ?? null,
        };
    }
    static toSecureResponse(data) {
        const { vendor, wallet } = data;
        return {
            id: vendor.id,
            companyName: vendor.companyName,
            rcNumber: vendor.rcNumber,
            businessAddress: vendor.businessAddress,
            phoneNumber: vendor.phoneNumber,
            email: vendor.email,
            documentsUrl: vendor.documentsUrl,
            status: vendor.status,
            isActive: vendor.isActive,
            isSuspended: vendor.isSuspended,
            lastLoginAt: vendor.lastLoginAt ?? null,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
            wallet: wallet,
        };
    }
}
exports.VendorMapper = VendorMapper;
//# sourceMappingURL=vendor.mapper.js.map