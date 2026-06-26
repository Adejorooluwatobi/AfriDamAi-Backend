import { IAdminRepository } from '../repositories/admin.repository.interface';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
export type AdminNotificationCategory = 'APPOINTMENT' | 'SALES' | 'SUBSCRIPTION' | 'FINANCE' | 'ACCOUNT';
export declare class AdminNotificationService {
    private readonly adminRepository;
    private readonly mailService;
    private readonly logger;
    constructor(adminRepository: IAdminRepository, mailService: MailService);
    notify(category: AdminNotificationCategory, eventName: string, detailsHtml: string, sendEmail?: boolean): Promise<void>;
}
