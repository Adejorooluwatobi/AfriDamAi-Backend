import { Controller, Get, Post, Body, Param, ValidationPipe, Put, Delete, UseGuards, Request, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/domain/services/admin.service';
import { ApiOperation, ApiBearerAuth, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { UpdateAdminDto } from 'src/application/DTOs/admin/update-admin.dto';
import { AdminMapper } from 'src/infrastructure/mappers/admin.mapper';
import { SecureAdminResponseDto } from 'src/application/DTOs/response.dto';
import { AdminGuard, SuperAdminGuard } from '../auth/guards';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';

@ApiExtraModels(CreateAdminDto)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, type: SecureAdminResponseDto })
  async create(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.createAdmin(createAdminDto);
    if (!admin) {
      throw new InternalServerErrorException('Admin creation failed');
    }
    const secureAdmin = AdminMapper.toSecureResponse(admin);
    return {
      succeeded: true,
      message: 'Admin created successfully',
      resultData: secureAdmin
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all admins' })
  @ApiResponse({ status: 201, type: SecureAdminResponseDto })
  async findAll() {
    const admins = await this.adminService.findAllAdmin();
    const secureAdmins = admins.map(admin => AdminMapper.toSecureResponse(admin));
    return {
      succeeded: true,
      message: 'Admins retrieved successfully',
      resultData: secureAdmins
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin info with profile' })
  @ApiResponse({ status: 201, type: SecureAdminResponseDto })
  async getMe(@Request() req: any) {
    // 🛡️ RE-ENFORCED: Robust ID extraction
    // Supports various JWT strategies (req.user, req.admin, nested admin object)
    const id = req.user?.id || req.user?.admin?.id || req.admin?.id;

    if (!id) {
      throw new UnauthorizedException('Admin ID missing from session');
    }

    const admin = await this.adminService.findOneAdmin(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    const secureAdmin = AdminMapper.toSecureResponse(admin);
    return {
      succeeded: true,
      message: 'Admin info retrieved successfully',
      resultData: secureAdmin
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an admin by ID' })
  @ApiResponse({ status: 201, type: SecureAdminResponseDto })
  async findOne(@Param('id') id: string) {
    const admin = await this.adminService.findOneAdmin(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    const secureAdmin = AdminMapper.toSecureResponse(admin);
    return {
      succeeded: true,
      message: 'Admin retrieved successfully',
      resultData: secureAdmin
    };
  }

  @UseGuards(SuperAdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiResponse({ status: 201, type: SecureAdminResponseDto })
  async update(@Param('id') id: string, @Body() updateAdminDto: Partial<UpdateAdminDto>) {
    const admin = await this.adminService.updateAdmin(id, updateAdminDto);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    const secureAdmin = AdminMapper.toSecureResponse(admin);
    return {
      succeeded: true,
      message: 'Admin updated successfully',
      resultData: secureAdmin
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin by ID' })
  async delete(@Param('id') id: string) {
    await this.adminService.deleteAdmin(id);
    return {
      succeeded: true,
      message: 'Admin deleted successfully'
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/active-status')
  @ApiOperation({ summary: 'Enable/Disable admin account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureAdminResponseDto })
  async updateActiveStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateAccountStatusDto) {
    const admin = await this.adminService.updateAdminActiveStatus(id, statusDto.isActive);
    return {
      succeeded: true,
      message: `Admin account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
      resultData: AdminMapper.toSecureResponse(admin)
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/suspension-status')
  @ApiOperation({ summary: 'Suspend/Unsuspend admin account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureAdminResponseDto })
  async updateSuspensionStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateSuspensionStatusDto) {
    const admin = await this.adminService.updateAdminSuspensionStatus(id, statusDto.isSuspended);
    return {
      succeeded: true,
      message: `Admin account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      resultData: AdminMapper.toSecureResponse(admin)
    };
  }

  @Get('logs/webhooks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve Webhook logs for troubleshooting' })
  async getWebhookLogs() {
    const logs = await this.adminService.getWebhookLogs();
    return {
      succeeded: true,
      message: 'Webhook logs retrieved successfully',
      resultData: logs
    };
  }

}