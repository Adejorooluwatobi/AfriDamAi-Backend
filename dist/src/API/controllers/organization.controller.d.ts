import { OrganizationService } from 'src/domain/services/organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from 'src/application/DTOs/organization/create-organization.dto';
import { OrganizationEntity } from 'src/domain/entities/organization.entity';
import { OrganizationStatus } from '@prisma/client';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { SpecialistAssignmentService } from 'src/domain/services/specialist-assignment.service';
import { AssignSpecialistsDto } from 'src/application/DTOs/appointments/assign-specialists.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
export declare class OrganizationController {
    private readonly organizationService;
    private readonly specialistService;
    private readonly specialistAssignmentService;
    constructor(organizationService: OrganizationService, specialistService: SpecialistService, specialistAssignmentService: SpecialistAssignmentService);
    create(createOrganizationDto: CreateOrganizationDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrganizationEntity;
    }>;
    findActive(): Promise<{
        succeeded: boolean;
        resultData: OrganizationEntity[];
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        resultData: OrganizationEntity[];
    }>;
    findOne(id: string): Promise<{
        succeeded: boolean;
        resultData: OrganizationEntity;
    }>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrganizationEntity;
    }>;
    updateStatus(id: string, status: OrganizationStatus): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrganizationEntity;
    }>;
    getSpecialistsForOrganization(id: string): Promise<{
        succeeded: boolean;
        resultData: import("../../application/DTOs/response.dto").SecureSpecialistResponseDto[];
    }>;
    onboardSpecialist(id: string, createSpecialistDto: CreateSpecialistDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureSpecialistResponseDto;
    }>;
    assignSpecialistToAppointment(organizationId: string, appointmentId: string, assignDto: AssignSpecialistsDto, req: any): Promise<import("../../domain/entities/specialist-assignment.entity").SpecialistAssignmentEntity[]>;
    private validateDomainAccess;
    onboardFacilityAdmin(organizationId: string, createAdminDto: CreateAdminDto, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureAdminResponseDto;
    }>;
    getAdminsForOrganization(organizationId: string, req: any): Promise<{
        succeeded: boolean;
        resultData: import("../../application/DTOs/response.dto").SecureAdminResponseDto[];
    }>;
    suspendAdmin(organizationId: string, adminId: string, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureAdminResponseDto;
    }>;
    activateAdmin(organizationId: string, adminId: string, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureAdminResponseDto;
    }>;
    suspendSpecialist(organizationId: string, specialistId: string, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureSpecialistResponseDto;
    }>;
    activateSpecialist(organizationId: string, specialistId: string, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/response.dto").SecureSpecialistResponseDto;
    }>;
}
