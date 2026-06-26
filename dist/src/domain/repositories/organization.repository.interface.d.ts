import { OrganizationEntity } from '../entities/organization.entity';
export interface IOrganizationRepository {
    create(data: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
    findById(id: string): Promise<OrganizationEntity | null>;
    findByEmail(email: string): Promise<OrganizationEntity | null>;
    findAll(): Promise<OrganizationEntity[]>;
    update(id: string, data: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
    delete(id: string): Promise<void>;
    findActive(): Promise<OrganizationEntity[]>;
}
