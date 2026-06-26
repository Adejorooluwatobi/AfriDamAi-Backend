import { IOrganizationRepository } from '../repositories/organization.repository.interface';
import { OrganizationEntity } from '../entities/organization.entity';
import { CreateOrganizationParams, UpdateOrganizationParams, CreateAdminParams } from 'src/utils/type';
import { OrganizationStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { SpecialistService } from './specialist.service';
import { AdminEntity } from '../entities/admin.entity';
import { SpecialistEntity } from '../entities/specialist.entity';
export declare class OrganizationService {
    private readonly organizationRepository;
    private readonly adminService;
    private readonly specialistService;
    private readonly logger;
    constructor(organizationRepository: IOrganizationRepository, adminService: AdminService, specialistService: SpecialistService);
    createOrganization(params: CreateOrganizationParams): Promise<OrganizationEntity>;
    findById(id: string): Promise<OrganizationEntity>;
    findAll(): Promise<OrganizationEntity[]>;
    findActive(): Promise<OrganizationEntity[]>;
    updateOrganization(id: string, params: UpdateOrganizationParams): Promise<OrganizationEntity>;
    updateOrganizationStatus(id: string, status: OrganizationStatus): Promise<OrganizationEntity>;
    deleteOrganization(id: string): Promise<void>;
    onboardAdmin(organizationId: string, adminParams: CreateAdminParams): Promise<AdminEntity>;
    getAdmins(organizationId: string): Promise<AdminEntity[]>;
    getSpecialists(organizationId: string): Promise<SpecialistEntity[]>;
    suspendAdmin(organizationId: string, adminId: string): Promise<AdminEntity>;
    activateAdmin(organizationId: string, adminId: string): Promise<AdminEntity>;
    suspendSpecialist(organizationId: string, specialistId: string): Promise<SpecialistEntity>;
    activateSpecialist(organizationId: string, specialistId: string): Promise<SpecialistEntity>;
}
