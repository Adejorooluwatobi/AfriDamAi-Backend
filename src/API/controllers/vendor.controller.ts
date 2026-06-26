import { Controller, Get, Post, Body, Param, ValidationPipe, Put, Delete, UseGuards, Request, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { VendorService } from 'src/domain/services/vendor.service';
import { ApiOperation, ApiBearerAuth, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { SecureUserResponseDto } from 'src/application/DTOs/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { UpdateVendorDto } from 'src/application/DTOs/vendor/update-vendor.dto';
import { VendorMapper } from 'src/infrastructure/mappers/vendor.mapper';
import { SecureVendorResponseDto } from 'src/application/DTOs/response.dto';
import { AdminGuard } from '../auth/guards';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
import { UpdateApprovalStatusDto } from 'src/application/DTOs/update-approval-status.dto';

import { VendorStatus } from 'src/domain/entities/vendor.entity';

@ApiExtraModels(CreateVendorDto)
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully', type: SecureVendorResponseDto })
  async create(@Body(new ValidationPipe()) createVendorDto: CreateVendorDto) {
    const vendor = await this.vendorService.createVendor({
      ...createVendorDto,
      status: VendorStatus.PENDING
    });
    if (!vendor) {
      throw new InternalServerErrorException('Vendor creation failed');
    }
    // We fetch the wallet to ensure it's included in the response after creation
    const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
    const secureVendor = VendorMapper.toSecureResponse({ vendor, wallet });
    return {
      succeeded: true,
      message: 'Vendor created successfully',
      resultData: secureVendor
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all vendors' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully', type: [SecureVendorResponseDto] })
  async findAll() {
    const vendors = await this.vendorService.findAllVendor();
    const secureVendors = await Promise.all(vendors.map(async vendor => {
      const wallet = await this.vendorService.findOneVendor(vendor.id).then(res => res?.wallet || null);
      return VendorMapper.toSecureResponse({ vendor, wallet });
    }));
    return {
      succeeded: true,
      message: 'Vendors retrieved successfully',
      resultData: secureVendors
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current vendor info with profile' })
  @ApiResponse({ status: 200, description: 'Vendor info retrieved successfully', type: SecureVendorResponseDto })
  async getMe(@Request() req: any) {
    const vendorId = this.extractVendorId(req.user);
    const result = await this.vendorService.findOneVendor(vendorId);
    if (!result || !result.vendor) {
      throw new NotFoundException('Vendor not found');
    }
    const secureVendor = VendorMapper.toSecureResponse(result);
    return {
      succeeded: true,
      message: 'Vendor info retrieved successfully',
      resultData: secureVendor
    };
  }

  private extractVendorId(user: any): string {
    // 🛡️ RE-ENFORCED: Consistent ID extraction from JWT payload
    const id = user.id || user.sub;
    if (id) return id;
    throw new UnauthorizedException('Vendor ID missing from token');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully', type: SecureVendorResponseDto })
  async findOne(@Param('id') id: string) {
    const result = await this.vendorService.findOneVendor(id);
    if (!result || !result.vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    const secureVendor = VendorMapper.toSecureResponse(result);
    return {
      succeeded: true,
      message: 'Vendor retrieved successfully',
      resultData: secureVendor
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully', type: SecureVendorResponseDto })
  async update(@Param('id') id: string, @Body() updateVendorDto: Partial<UpdateVendorDto>) {
    const vendor = await this.vendorService.updateVendor(id, updateVendorDto);
    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    // Fetch wallet to include in secure response
    const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
    const secureVendor = VendorMapper.toSecureResponse({ vendor, wallet });
    return {
      succeeded: true,
      message: 'Vendor updated successfully',
      resultData: secureVendor
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an vendor by ID' })
  async delete(@Param('id') id: string) {
    await this.vendorService.deleteVendor(id);
    return {
      succeeded: true,
      message: 'Vendor deleted successfully'
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/active-status')
  @ApiOperation({ summary: 'Enable/Disable vendor account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureVendorResponseDto })
  async updateActiveStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateAccountStatusDto) {
    const vendor = await this.vendorService.updateVendorActiveStatus(id, statusDto.isActive);
    // Fetch wallet to include in secure response
    const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
    const secureVendor = VendorMapper.toSecureResponse({ vendor, wallet });
    return {
      succeeded: true,
      message: `Vendor account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
      resultData: secureVendor
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/suspension-status')
  @ApiOperation({ summary: 'Suspend/Unsuspend vendor account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureVendorResponseDto })
  async updateSuspensionStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateSuspensionStatusDto) {
    const vendor = await this.vendorService.updateVendorSuspensionStatus(id, statusDto.isSuspended);
    const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
    return {
      succeeded: true,
      message: `Vendor account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      resultData: VendorMapper.toSecureResponse({ vendor, wallet })
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/approval-status')
  @ApiOperation({ summary: 'Approve/Reject vendor account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureVendorResponseDto })
  async updateApprovalStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateApprovalStatusDto) {
    const vendor = await this.vendorService.updateVendorApprovalStatus(id, statusDto.status as any);
    const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
    return {
      succeeded: true,
      message: `Vendor approval status updated to ${statusDto.status} successfully`,
      resultData: VendorMapper.toSecureResponse({ vendor, wallet })
    };
  }
}