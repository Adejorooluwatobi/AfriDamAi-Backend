"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const vendor_service_1 = require("../../domain/services/vendor.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_vendor_dto_1 = require("../../application/DTOs/vendor/create-vendor.dto");
const vendor_mapper_1 = require("../../infrastructure/mappers/vendor.mapper");
const response_dto_1 = require("../../application/DTOs/response.dto");
const guards_1 = require("../auth/guards");
const update_account_status_dto_1 = require("../../application/DTOs/update-account-status.dto");
const update_suspension_status_dto_1 = require("../../application/DTOs/update-suspension-status.dto");
const update_approval_status_dto_1 = require("../../application/DTOs/update-approval-status.dto");
const vendor_entity_1 = require("../../domain/entities/vendor.entity");
let VendorController = class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async create(createVendorDto) {
        const vendor = await this.vendorService.createVendor({
            ...createVendorDto,
            status: vendor_entity_1.VendorStatus.PENDING
        });
        if (!vendor) {
            throw new common_1.InternalServerErrorException('Vendor creation failed');
        }
        const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
        const secureVendor = vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet });
        return {
            succeeded: true,
            message: 'Vendor created successfully',
            resultData: secureVendor
        };
    }
    async findAll() {
        const vendors = await this.vendorService.findAllVendor();
        const secureVendors = await Promise.all(vendors.map(async (vendor) => {
            const wallet = await this.vendorService.findOneVendor(vendor.id).then(res => res?.wallet || null);
            return vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet });
        }));
        return {
            succeeded: true,
            message: 'Vendors retrieved successfully',
            resultData: secureVendors
        };
    }
    async getMe(req) {
        const vendorId = this.extractVendorId(req.user);
        const result = await this.vendorService.findOneVendor(vendorId);
        if (!result || !result.vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        const secureVendor = vendor_mapper_1.VendorMapper.toSecureResponse(result);
        return {
            succeeded: true,
            message: 'Vendor info retrieved successfully',
            resultData: secureVendor
        };
    }
    extractVendorId(user) {
        const id = user.id || user.sub;
        if (id)
            return id;
        throw new common_1.UnauthorizedException('Vendor ID missing from token');
    }
    async findOne(id) {
        const result = await this.vendorService.findOneVendor(id);
        if (!result || !result.vendor) {
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        }
        const secureVendor = vendor_mapper_1.VendorMapper.toSecureResponse(result);
        return {
            succeeded: true,
            message: 'Vendor retrieved successfully',
            resultData: secureVendor
        };
    }
    async update(id, updateVendorDto) {
        const vendor = await this.vendorService.updateVendor(id, updateVendorDto);
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        }
        const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
        const secureVendor = vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet });
        return {
            succeeded: true,
            message: 'Vendor updated successfully',
            resultData: secureVendor
        };
    }
    async delete(id) {
        await this.vendorService.deleteVendor(id);
        return {
            succeeded: true,
            message: 'Vendor deleted successfully'
        };
    }
    async updateActiveStatus(id, statusDto) {
        const vendor = await this.vendorService.updateVendorActiveStatus(id, statusDto.isActive);
        const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
        const secureVendor = vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet });
        return {
            succeeded: true,
            message: `Vendor account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
            resultData: secureVendor
        };
    }
    async updateSuspensionStatus(id, statusDto) {
        const vendor = await this.vendorService.updateVendorSuspensionStatus(id, statusDto.isSuspended);
        const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
        return {
            succeeded: true,
            message: `Vendor account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
            resultData: vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet })
        };
    }
    async updateApprovalStatus(id, statusDto) {
        const vendor = await this.vendorService.updateVendorApprovalStatus(id, statusDto.status);
        const { wallet } = await this.vendorService.findOneVendor(vendor.id).then(res => res || { wallet: null });
        return {
            succeeded: true,
            message: `Vendor approval status updated to ${statusDto.status} successfully`,
            resultData: vendor_mapper_1.VendorMapper.toSecureResponse({ vendor, wallet })
        };
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new vendor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vendor created successfully', type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vendor_dto_1.CreateVendorDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all vendors' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendors retrieved successfully', type: [response_dto_1.SecureVendorResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current vendor info with profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor info retrieved successfully', type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve an vendor by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor retrieved successfully', type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an vendor by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor updated successfully', type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an vendor by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/active-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable/Disable vendor account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateActiveStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/suspension-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend/Unsuspend vendor account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_suspension_status_dto_1.UpdateSuspensionStatusDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateSuspensionStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/approval-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve/Reject vendor account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureVendorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_approval_status_dto_1.UpdateApprovalStatusDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateApprovalStatus", null);
exports.VendorController = VendorController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_vendor_dto_1.CreateVendorDto),
    (0, common_1.Controller)('vendors'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map