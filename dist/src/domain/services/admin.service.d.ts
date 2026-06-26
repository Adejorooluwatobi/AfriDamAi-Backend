import { AdminEntity } from '../entities/admin.entity';
import { CreateAdminParams } from 'src/utils/type';
import type { IAdminRepository } from '../repositories/admin.repository.interface';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
export declare class AdminService {
    private readonly adminRepository;
    private readonly prisma;
    private readonly mailService;
    constructor(adminRepository: IAdminRepository, prisma: PrismaService, mailService: MailService);
    createAdmin(adminDetails: CreateAdminParams): Promise<AdminEntity>;
    findAllAdmin(): Promise<AdminEntity[]>;
    findOneAdmin(id: string): Promise<AdminEntity | null>;
    updateAdmin(id: string, updateAdminDetails: Partial<AdminEntity>): Promise<AdminEntity>;
    updateAdminActiveStatus(id: string, isActive: boolean): Promise<AdminEntity>;
    updateAdminSuspensionStatus(id: string, isSuspended: boolean): Promise<AdminEntity>;
    deleteAdmin(id: string): Promise<void>;
    findByEmail(email: string): Promise<AdminEntity | null>;
    findByRole(role: any): Promise<AdminEntity[]>;
    getWebhookLogs(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        gateway: string;
        event: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
}
