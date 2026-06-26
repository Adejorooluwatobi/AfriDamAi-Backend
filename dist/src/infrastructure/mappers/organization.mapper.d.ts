import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { Organization } from '@prisma/client';
export declare class OrganizationMapper {
    static toDomain(raw: Organization): OrganizationEntity;
    static toDomainArray(raws: Organization[]): OrganizationEntity[];
    static toPersistence(domain: OrganizationEntity): Organization;
}
