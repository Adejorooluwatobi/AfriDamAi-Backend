import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { UpdateSpecialistDto } from 'src/application/DTOs/specialist/update-specialist.dto';
import { SecureSpecialistResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
import { UpdateApprovalStatusDto } from 'src/application/DTOs/update-approval-status.dto';
import { SpecialistStatus, SpecialistType } from '@prisma/client';
export declare class SpecialistController {
    private readonly specialistService;
    constructor(specialistService: SpecialistService);
    create(createSpecialistDto: CreateSpecialistDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto[];
    }>;
    findByType(type: SpecialistType): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto[];
    }>;
    findByStatus(status: SpecialistStatus): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto[];
    }>;
    getMe(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
    private extractSpecialistId;
    findOne(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
    update(id: string, updateSpecialistDto: UpdateSpecialistDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../domain/entities/specialist.entity").SpecialistEntity;
    }>;
    updateApprovalStatus(id: string, statusDto: UpdateApprovalStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
    updateSuspensionStatus(id: string, statusDto: UpdateSuspensionStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
    remove(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    updateActiveStatus(id: string, statusDto: UpdateAccountStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureSpecialistResponseDto;
    }>;
}
