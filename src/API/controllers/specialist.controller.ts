import {
  Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe,
  UseGuards, NotFoundException, InternalServerErrorException, Request, UnauthorizedException
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { UpdateSpecialistDto } from 'src/application/DTOs/specialist/update-specialist.dto';
import { SpecialistMapper } from 'src/infrastructure/mappers/specialist.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard, SpecialistOrAdminGuard } from '../auth/guards';
import { UpdateSpecialistStatusDto } from 'src/application/DTOs/specialist/update-specialist-status.dto';
import { SecureSpecialistResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
import { UpdateApprovalStatusDto } from 'src/application/DTOs/update-approval-status.dto';

import { SpecialistStatus, SpecialistType } from '@prisma/client';

@ApiTags('Specialists')
@Controller('specialists')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new specialist' })
  @ApiResponse({ status: 201, description: 'Specialist created successfully' })
  async create(@Body(new ValidationPipe()) createSpecialistDto: CreateSpecialistDto) {
    const specialist = await this.specialistService.createSpecialist(createSpecialistDto);
    if (!specialist) {
      throw new InternalServerErrorException('Specialist creation failed');
    }
    const { specialist: entity, wallet } = await this.specialistService.findById(specialist.id);
    return {
      succeeded: true,
      message: 'Specialist created successfully',
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet })
    };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all specialists' })
  @ApiResponse({ status: 200, description: 'Specialist retrieved successfully', type: [SecureSpecialistResponseDto] })
  async findAll() {
    const specialists = await this.specialistService.findAll();
    const secureSpecialists = await Promise.all(specialists.map(async s => {
        const { wallet } = await this.specialistService.findById(s.id);
        return SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
    }));
    return {
      succeeded: true,
      message: 'Specialists retrieved successfully',
      resultData: secureSpecialists
    };
  }

  @Get('type/:type')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve specialists by type' })
  @ApiResponse({ status: 200, description: 'Specialists retrieved successfully', type: [SecureSpecialistResponseDto] })
  async findByType(@Param('type') type: SpecialistType) {
    const specialists = await this.specialistService.findByType(type);
    const secureSpecialists = await Promise.all(specialists.map(async s => {
        const { wallet } = await this.specialistService.findById(s.id);
        return SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
    }));
    return {
      succeeded: true,
      message: `Specialists of type ${type} retrieved successfully`,
      resultData: secureSpecialists
    };
  }

  @Get('status/:status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve specialists by status' })
  @ApiResponse({ status: 200, description: 'Specialists retrieved successfully', type: [SecureSpecialistResponseDto] })
  async findByStatus(@Param('status') status: SpecialistStatus) {
    const specialists = await this.specialistService.findByStatus(status);
    const secureSpecialists = await Promise.all(specialists.map(async s => {
        const { wallet } = await this.specialistService.findById(s.id);
        return SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
    }));
    return {
      succeeded: true,
      message: `Specialists with status ${status} retrieved successfully`,
      resultData: secureSpecialists
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current specialist info with profile' })
  @ApiResponse({ status: 200, description: 'Specialist retrieved successfully', type: SecureSpecialistResponseDto })
  async getMe(@Request() req: any) {
    const specialistId = this.extractSpecialistId(req.user);
    const { specialist, wallet } = await this.specialistService.findById(specialistId);
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }
    const secureSpecialist = SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet });
    return {
      succeeded: true,
      message: 'Specialist info retrieved successfully',
      resultData: secureSpecialist
    };
  }

  private extractSpecialistId(user: any): string {
    // 🛡️ RE-ENFORCED: Consistent ID extraction from JWT payload
    const id = user.id || user.sub;
    if (id) return id;
    throw new UnauthorizedException('Specialist ID missing from token');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a specialist by ID' })
  @ApiResponse({ status: 200, description: 'Specialist retrieved successfully', type: SecureSpecialistResponseDto })
  async findOne(@Param('id') id: string) {
    const specialist = await this.specialistService.findById(id);
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }
    const { specialist: entity, wallet } = await this.specialistService.findById(id);
    return {
        succeeded: true,
        message: 'Specialist retrieved successfully',
        resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet })
    };
  }

  @Put(':id')
  @UseGuards(SpecialistOrAdminGuard) // Or Specialist herself? For now Admin.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specialist' })
  @ApiResponse({ status: 200, description: 'Specialist updated successfully', type: SecureSpecialistResponseDto })
  async update(@Param('id') id: string, @Body() updateSpecialistDto: UpdateSpecialistDto) {
    const specialist = await this.specialistService.updateSpecialist(id, updateSpecialistDto);
    return {
      succeeded: true,
      message: 'Specialist updated successfully',
      resultData: (specialist)
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/approval-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specialist\'s approval status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Specialist approval status updated successfully', type: SecureSpecialistResponseDto })
  async updateApprovalStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) statusDto: UpdateApprovalStatusDto,
  ) {
    const specialist = await this.specialistService.updateSpecialistStatus(id, statusDto.status as any);
    const { wallet } = await this.specialistService.findById(specialist.id);
    return {
      succeeded: true,
      message: 'Specialist approval status updated successfully',
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/suspension-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend/Unsuspend specialist account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureSpecialistResponseDto })
  async updateSuspensionStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateSuspensionStatusDto) {
    const specialist = await this.specialistService.updateSpecialistSuspensionStatus(id, statusDto.isSuspended);
    const { wallet } = await this.specialistService.findById(specialist.id);
    return {
      succeeded: true,
      message: `Specialist account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet })
    };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specialist' })
  @ApiResponse({ status: 200, description: 'Specialist deleted successfully', type: SecureSpecialistResponseDto })
  async remove(@Param('id') id: string) {
    await this.specialistService.deleteSpecialist(id);
    return {
      succeeded: true,
      message: 'Specialist deleted successfully'
    };
  }

  @Put(':id/active-status')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable/Disable specialist account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureSpecialistResponseDto })
  async updateActiveStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateAccountStatusDto) {
    const specialist = await this.specialistService.updateSpecialistActiveStatus(id, statusDto.isActive);
    const { wallet } = await this.specialistService.findById(specialist.id);
    return {
      succeeded: true,
      message: `Specialist account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
      resultData: SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet })
    };
  }
}

