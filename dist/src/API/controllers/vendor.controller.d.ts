import { VendorService } from 'src/domain/services/vendor.service';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { UpdateVendorDto } from 'src/application/DTOs/vendor/update-vendor.dto';
import { SecureVendorResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
import { UpdateApprovalStatusDto } from 'src/application/DTOs/update-approval-status.dto';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    create(createVendorDto: CreateVendorDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto[];
    }>;
    getMe(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    private extractVendorId;
    findOne(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    update(id: string, updateVendorDto: Partial<UpdateVendorDto>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    updateActiveStatus(id: string, statusDto: UpdateAccountStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    updateSuspensionStatus(id: string, statusDto: UpdateSuspensionStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
    updateApprovalStatus(id: string, statusDto: UpdateApprovalStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureVendorResponseDto;
    }>;
}
