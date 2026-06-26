import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { IOrganizationRepository } from '../repositories/organization.repository.interface';
import { OrganizationEntity } from '../entities/organization.entity';
import { CreateOrganizationParams, UpdateOrganizationParams, CreateAdminParams } from 'src/utils/type';
import { OrganizationStatus, AdminType } from '@prisma/client';
import { AdminService } from './admin.service';
import { SpecialistService } from './specialist.service';
import { AdminEntity } from '../entities/admin.entity';
import { SpecialistEntity } from '../entities/specialist.entity';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly adminService: AdminService,
    private readonly specialistService: SpecialistService,
  ) {}

  async createOrganization(params: CreateOrganizationParams): Promise<OrganizationEntity> {
    const existingOrg = await this.organizationRepository.findByEmail(params.email);
    if (existingOrg) {
      throw new BadRequestException('Organization with this email already exists');
    }

    const newOrg = await this.organizationRepository.create({
      ...params,
      status: params.status ?? OrganizationStatus.PENDING,
      isActive: params.isActive ?? true,
    });
    
    this.logger.log(`Created Organization: ${newOrg.id}`);
    return newOrg;
  }

  async findById(id: string): Promise<OrganizationEntity> {
    const org = await this.organizationRepository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async findAll(): Promise<OrganizationEntity[]> {
    return this.organizationRepository.findAll();
  }

  async findActive(): Promise<OrganizationEntity[]> {
    return this.organizationRepository.findActive();
  }

  async updateOrganization(id: string, params: UpdateOrganizationParams): Promise<OrganizationEntity> {
    const org = await this.findById(id);

    if (params.email && params.email !== org.email) {
      const existingEmail = await this.organizationRepository.findByEmail(params.email);
      if (existingEmail) throw new BadRequestException('Email is already in use by another organization');
    }

    const updatedOrg = await this.organizationRepository.update(id, params);
    this.logger.log(`Updated Organization: ${id}`);
    return updatedOrg;
  }

  async updateOrganizationStatus(id: string, status: OrganizationStatus): Promise<OrganizationEntity> {
    const org = await this.findById(id);
    const updated = await this.organizationRepository.update(id, { status });
    this.logger.log(`Updated Organization: ${id} status to ${status}`);
    return updated;
  }

  async deleteOrganization(id: string): Promise<void> {
    const org = await this.findById(id);
    await this.organizationRepository.delete(id);
    this.logger.log(`Deleted Organization: ${id}`);
  }

  async onboardAdmin(organizationId: string, adminParams: CreateAdminParams): Promise<AdminEntity> {
    const org = await this.findById(organizationId);
    if (org.status !== OrganizationStatus.APPROVED) {
      throw new BadRequestException('Organization must be APPROVED to onboard admins');
    }

    return this.adminService.createAdmin({
      ...adminParams,
      organizationId,
      type: AdminType.FACILITY_ADMIN,
    });
  }

  async getAdmins(organizationId: string): Promise<AdminEntity[]> {
    const admins = await this.adminService.findAllAdmin();
    return admins.filter(admin => admin.organizationId === organizationId);
  }

  async getSpecialists(organizationId: string): Promise<SpecialistEntity[]> {
    const wrapped = await this.specialistService.findByOrganization(organizationId);
    return wrapped.map(w => w.specialist);
  }

  async suspendAdmin(organizationId: string, adminId: string): Promise<AdminEntity> {
    const admin = await this.adminService.findOneAdmin(adminId);
    if (!admin || admin.organizationId !== organizationId) {
      throw new NotFoundException('Admin not found in this organization');
    }
    return this.adminService.updateAdminActiveStatus(adminId, false);
  }

  async activateAdmin(organizationId: string, adminId: string): Promise<AdminEntity> {
    const admin = await this.adminService.findOneAdmin(adminId);
    if (!admin || admin.organizationId !== organizationId) {
      throw new NotFoundException('Admin not found in this organization');
    }
    return this.adminService.updateAdminActiveStatus(adminId, true);
  }

  async suspendSpecialist(organizationId: string, specialistId: string): Promise<SpecialistEntity> {
    const { specialist } = await this.specialistService.findById(specialistId);
    if (!specialist || specialist.organizationId !== organizationId) {
      throw new NotFoundException('Specialist not found in this organization');
    }
    return this.specialistService.updateSpecialistActiveStatus(specialistId, false);
  }

  async activateSpecialist(organizationId: string, specialistId: string): Promise<SpecialistEntity> {
    const { specialist } = await this.specialistService.findById(specialistId);
    if (!specialist || specialist.organizationId !== organizationId) {
      throw new NotFoundException('Specialist not found in this organization');
    }
    return this.specialistService.updateSpecialistActiveStatus(specialistId, true);
  }
}
