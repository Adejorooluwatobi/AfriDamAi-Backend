import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendResetPasswordEmail(email: string, token: string): Promise<boolean>;
    sendVerificationCodeEmail(email: string, code: string): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string, role: string): Promise<boolean>;
    sendAppointmentCreatedEmail(email: string, appointmentDetails: any): Promise<boolean>;
    sendAppointmentAcceptedEmail(email: string, specialistName: string, appointmentDetails: any): Promise<boolean>;
    sendSpecialistAppointmentAcceptedEmail(email: string, patientName: string, appointmentDetails: any): Promise<boolean>;
    sendSessionStartEndEmail(email: string, otherPartyName: string, status: 'STARTED' | 'ENDED', appointmentDetails: any): Promise<boolean>;
    sendOrderPurchaseEmail(email: string, orderDetails: any, role: 'USER' | 'VENDOR'): Promise<boolean>;
    sendWithdrawalStatusEmail(email: string, amount: number, status: string, notes?: string): Promise<boolean>;
    sendAdminNotificationEmail(email: string, subject: string, html: string): Promise<boolean>;
    sendSubscriptionStatusEmail(email: string, planName: string, status: 'SUCCESS' | 'FAILED', reason?: string): Promise<boolean>;
    sendAutoRenewalStatusEmail(email: string, planName: string, isEnabled: boolean): Promise<boolean>;
    sendAccountStatusEmail(email: string, name: string, status: 'ACTIVATED' | 'DEACTIVATED' | 'SUSPENDED' | 'UNSUSPENDED', role: string): Promise<boolean>;
    sendProductDeletedEmail(email: string, productName: string, reason?: string): Promise<boolean>;
}
