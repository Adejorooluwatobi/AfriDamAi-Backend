import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { Organization } from '@prisma/client';

export class OrganizationMapper {
  static toDomain(raw: Organization): OrganizationEntity {
    return new OrganizationEntity({
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

  static toDomainArray(raws: Organization[]): OrganizationEntity[] {
    return raws.map((o) => this.toDomain(o));
  }

  static toPersistence(domain: OrganizationEntity): Organization {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      phone: domain.phone,
      address: domain.address ?? null,
      logoUrl: domain.logoUrl ?? null,
      brandingColors: domain.brandingColors ? (domain.brandingColors as any) : null,
      licenseUrl: domain.licenseUrl ?? null,
      licenseNumber: domain.licenseNumber ?? null,
      status: domain.status,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
