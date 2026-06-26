import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, UseGuards, UnauthorizedException, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from 'src/domain/services/organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from 'src/application/DTOs/organization/create-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationEntity } from 'src/domain/entities/organization.entity';
import { AdminGuard } from '../auth/guards';
import { AdminType, OrganizationStatus } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { SpecialistMapper } from 'src/infrastructure/mappers/specialist.mapper';
import { SpecialistAssignmentService } from 'src/domain/services/specialist-assignment.service';
import { AssignSpecialistsDto } from 'src/application/DTOs/appointments/assign-specialists.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { AdminMapper } from 'src/infrastructure/mappers/admin.mapper';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly specialistService: SpecialistService,
    private readonly specialistAssignmentService: SpecialistAssignmentService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new Hospital/Organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully', type: OrganizationEntity })
  async create(@Body(new ValidationPipe()) createOrganizationDto: CreateOrganizationDto) {
    const org = await this.organizationService.createOrganization(createOrganizationDto);
    return {
      succeeded: true,
      message: 'Organization registered successfully',
      resultData: org,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all active organizations (Discovery for Patients)' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully' })
  async findActive() {
    const orgs = await this.organizationService.findActive();
    return {
      succeeded: true,
      resultData: orgs,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List ALL organizations (Admin Only)' })
  async findAll() {
    const orgs = await this.organizationService.findAll();
    return {
      succeeded: true,
      resultData: orgs,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization details' })
  async findOne(@Param('id') id: string) {
    const org = await this.organizationService.findById(id);
    return {
      succeeded: true,
      resultData: org,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization profile' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateOrganizationDto: UpdateOrganizationDto, @Request() req: any) {
    // Ideally, check if the current user is a FACILITY_ADMIN for this org
    const updatedOrg = await this.organizationService.updateOrganization(id, updateOrganizationDto);
    return {
      succeeded: true,
      message: 'Organization updated successfully',
      resultData: updatedOrg,
    };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization status (Super Admin)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: OrganizationStatus) {
    const updatedOrg = await this.organizationService.updateOrganizationStatus(id, status);
    return {
      succeeded: true,
      message: `Organization status updated to ${status}`,
      resultData: updatedOrg,
    };
  }

  @Get(':id/specialists')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all specialists for a hospital' })
  async getSpecialistsForOrganization(@Param('id') id: string) {
    const specialists = await this.specialistService.findByOrganization(id);
    const result = specialists.map(({ specialist, wallet }) => 
      SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet })
    );

    return {
      succeeded: true,
      resultData: result,
    };
  }

  @Post(':id/specialists')
  @UseGuards(JwtAuthGuard) // Require Facility Admin logic here
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Onboard a specialist under a hospital' })
  async onboardSpecialist(
    @Param('id') id: string,
    @Body(new ValidationPipe()) createSpecialistDto: CreateSpecialistDto
  ) {
    // Ensure the org exists
    await this.organizationService.findById(id);

    const specialistDto = {
        ...createSpecialistDto,
        organizationId: id,
    };
    const newSpecialist = await this.specialistService.createSpecialist(specialistDto as any);
    const { specialist: entity, wallet } = await this.specialistService.findById(newSpecialist.id);

    return {
      succeeded: true,
      message: 'Specialist onboarded successfully under organization',
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet }),
    };
  }

  @Post(':id/appointments/:appointmentId/assign')
  @UseGuards(JwtAuthGuard, AdminGuard) // Facility Admin
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign specialists to an organization specific appointment' })
  @ApiResponse({ status: 201, description: 'Specialist assigned successfully' })
  async assignSpecialistToAppointment(
    @Param('id') organizationId: string,
    @Param('appointmentId') appointmentId: string,
    @Body(new ValidationPipe()) assignDto: AssignSpecialistsDto,
    @Request() req: any
  ) {
    // 1. Validate Organization exists
    await this.organizationService.findById(organizationId);
    
    // 2. Ideally validate that the FACILITY_ADMIN owns this org (Skipped for now, assuming standard auth guards handle domain scope)
    const adminId = req.user.id || req.user.sub;

    return this.specialistAssignmentService.assignSpecialists(
      appointmentId,
      assignDto.specialistIds,
      adminId
    );
  }

  private validateDomainAccess(organizationId: string, req: any) {
    const user = req.user;
    if (user.type === AdminType.SUPER_ADMIN) return;

    if (user.type === AdminType.FACILITY_ADMIN) {
      if (user.organizationId !== organizationId) {
        throw new ForbiddenException('Access denied: You can only manage your own organization');
      }
      return;
    }

    // Default to forbidden if not a recognized admin type with domain access
    throw new ForbiddenException('Access denied: Insufficient permissions for this organization');
  }

  @Post(':id/admins')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Onboard a Facility Admin under a hospital' })
  async onboardFacilityAdmin(
    @Param('id') organizationId: string,
    @Body(new ValidationPipe()) createAdminDto: CreateAdminDto,
    @Request() req: any
  ) {
    this.validateDomainAccess(organizationId, req);
    const admin = await this.organizationService.onboardAdmin(organizationId, createAdminDto);
    return {
      succeeded: true,
      message: 'Facility Admin onboarded successfully',
      resultData: AdminMapper.toSecureResponse(admin),
    };
  }

  @Get(':id/admins')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins for a hospital' })
  async getAdminsForOrganization(@Param('id') organizationId: string, @Request() req: any) {
    this.validateDomainAccess(organizationId, req);
    const admins = await this.organizationService.getAdmins(organizationId);
    return {
      succeeded: true,
      resultData: admins.map(admin => AdminMapper.toSecureResponse(admin)),
    };
  }

  @Put(':id/admins/:adminId/suspend')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a Facility Admin' })
  async suspendAdmin(@Param('id') organizationId: string, @Param('adminId') adminId: string, @Request() req: any) {
    this.validateDomainAccess(organizationId, req);
    const admin = await this.organizationService.suspendAdmin(organizationId, adminId);
    return {
      succeeded: true,
      message: 'Admin suspended successfully',
      resultData: AdminMapper.toSecureResponse(admin),
    };
  }

  @Put(':id/admins/:adminId/activate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a Facility Admin' })
  async activateAdmin(@Param('id') organizationId: string, @Param('adminId') adminId: string, @Request() req: any) {
    this.validateDomainAccess(organizationId, req);
    const admin = await this.organizationService.activateAdmin(organizationId, adminId);
    return {
      succeeded: true,
      message: 'Admin activated successfully',
      resultData: AdminMapper.toSecureResponse(admin),
    };
  }

  @Put(':id/specialists/:specialistId/suspend')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a Specialist' })
  async suspendSpecialist(@Param('id') organizationId: string, @Param('specialistId') specialistId: string, @Request() req: any) {
    this.validateDomainAccess(organizationId, req);
    const specialist = await this.organizationService.suspendSpecialist(organizationId, specialistId);
    const { wallet } = await this.specialistService.findById(specialistId);
    return {
      succeeded: true,
      message: 'Specialist suspended successfully',
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
    };
  }

  @Put(':id/specialists/:specialistId/activate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a Specialist' })
  async activateSpecialist(@Param('id') organizationId: string, @Param('specialistId') specialistId: string, @Request() req: any) {
    this.validateDomainAccess(organizationId, req);
    const specialist = await this.organizationService.activateSpecialist(organizationId, specialistId);
    const { wallet } = await this.specialistService.findById(specialistId);
    return {
      succeeded: true,
      message: 'Specialist activated successfully',
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
    };
  }
}

