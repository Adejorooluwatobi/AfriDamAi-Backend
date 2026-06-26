import { PrismaService } from './prisma.service';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationEntity } from '../../../domain/entities/organization.entity';
export declare class PrismaOrganizationRepository implements IOrganizationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
    findById(id: string): Promise<OrganizationEntity | null>;
    findByEmail(email: string): Promise<OrganizationEntity | null>;
    findAll(): Promise<OrganizationEntity[]>;
    update(id: string, data: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
    delete(id: string): Promise<void>;
    findActive(): Promise<OrganizationEntity[]>;
}
