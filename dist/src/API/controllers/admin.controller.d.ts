import { AdminService } from 'src/domain/services/admin.service';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { UpdateAdminDto } from 'src/application/DTOs/admin/update-admin.dto';
import { SecureAdminResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto[];
    }>;
    getMe(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    findOne(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    update(id: string, updateAdminDto: Partial<UpdateAdminDto>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    updateActiveStatus(id: string, statusDto: UpdateAccountStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    updateSuspensionStatus(id: string, statusDto: UpdateSuspensionStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureAdminResponseDto;
    }>;
    getWebhookLogs(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: {
            id: string;
            status: string;
            createdAt: Date;
            gateway: string;
            event: string;
            payload: import("@prisma/client/runtime/library").JsonValue;
        }[];
    }>;
}
