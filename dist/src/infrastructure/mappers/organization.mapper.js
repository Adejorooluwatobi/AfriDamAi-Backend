"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMapper = void 0;
const organization_entity_1 = require("../../domain/entities/organization.entity");
class OrganizationMapper {
    static toDomain(raw) {
        return new organization_entity_1.OrganizationEntity({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            phone: raw.phone,
            address: raw.address ?? undefined,
            logoUrl: raw.logoUrl ?? undefined,
            brandingColors: raw.brandingColors ?? undefined,
            licenseUrl: raw.licenseUrl ?? undefined,
            licenseNumber: raw.licenseNumber ?? undefined,
            status: raw.status,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map((o) => this.toDomain(o));
    }
    static toPersistence(domain) {
        return {
            id: domain.id,
            name: domain.name,
            email: domain.email,
            phone: domain.phone,
            address: domain.address ?? null,
            logoUrl: domain.logoUrl ?? null,
            brandingColors: domain.brandingColors ? domain.brandingColors : null,
            licenseUrl: domain.licenseUrl ?? null,
            licenseNumber: domain.licenseNumber ?? null,
            status: domain.status,
            isActive: domain.isActive,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }
}
exports.OrganizationMapper = OrganizationMapper;
//# sourceMappingURL=organization.mapper.js.map