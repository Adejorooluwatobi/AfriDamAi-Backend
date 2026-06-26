import { Injectable, Logger, Inject } from '@nestjs/common';
import { IAdminRepository } from '../repositories/admin.repository.interface';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { AdminType } from '@prisma/client';

export type AdminNotificationCategory = 'APPOINTMENT' | 'SALES' | 'SUBSCRIPTION' | 'FINANCE' | 'ACCOUNT';

@Injectable()
export class AdminNotificationService {
  private readonly logger = new Logger(AdminNotificationService.name);

  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    private readonly mailService: MailService,
  ) {}

  /**
   * Notify relevant admins about a system event.
   * Logic:
   * - SUPER_ADMIN and OPERATIONS_ADMIN receive EVERYTHING.
   * - MEDICAL_REVIEWER for Appointments.
   * - VENDOR_MANAGER for Sales/Products.
   * - FINANCE_ADMIN for Subscriptions, Product Purchases, and Withdrawals.
   */
  async notify(category: AdminNotificationCategory, eventName: string, detailsHtml: string, sendEmail: boolean = false) {
    const recipients: AdminType[] = [AdminType.SUPER_ADMIN, AdminType.OPERATIONS_ADMIN];

    switch (category) {
      case 'APPOINTMENT':
        recipients.push(AdminType.MEDICAL_REVIEWER);
        break;
      case 'SALES':
        recipients.push(AdminType.VENDOR_MANAGER, AdminType.FINANCE_ADMIN);
        break;
      case 'SUBSCRIPTION':
        recipients.push(AdminType.FINANCE_ADMIN);
        break;
      case 'FINANCE':
        recipients.push(AdminType.FINANCE_ADMIN);
        break;
      case 'ACCOUNT':
        // Only Super/Operations as defined in the base recipients
        break;
    }

    // De-duplicate roles
    const uniqueRoles = [...new Set(recipients)];

    try {
      // Fetch all admins with these roles
      const allAdmins = await Promise.all(
        uniqueRoles.map(role => this.adminRepository.findByRole(role))
      );

      const emailList = allAdmins.flat().map(admin => admin.email);
      const uniqueEmails = [...new Set(emailList)];

      if (uniqueEmails.length === 0) {
        this.logger.warn(`No admins found for category: ${category}. Notification skipped.`);
        return;
      }

      this.logger.log(`Dispatching notifications for ${eventName} (${category}) to ${uniqueEmails.length} admins (Email: ${sendEmail}).`);

      if (sendEmail) {
        // Send emails (concurrently for better performance)
        await Promise.all(
          uniqueEmails.map(email => 
            this.mailService.sendAdminNotificationEmail(
              email, 
              eventName, 
              `<h3>${eventName}</h3>${detailsHtml}`
            )
          )
        );
      }

    } catch (error) {
      this.logger.error(`Failed to dispatch admin notifications for ${eventName}: ${error.message}`);
    }
  }
}
