import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { IWithdrawalRequestRepository } from '../repositories/withdrawal-request.repository.interface';
import { WithdrawalRequestEntity } from '../entities/withdrawal-request.entity';
import { CreateWithdrawalRequestParams, UpdateWithdrawalRequestParams } from 'src/utils/type';
import { WalletService } from './wallet.service';
import { NotificationService } from './notification.service';
import { AdminService } from './admin.service';
import { WalletOwnerType, WithdrawalStatus, AdminType, WalletTransactionType, WalletRelatedEntityType } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IVendorRepository } from '../repositories/vendor.repository.interface';
import { ISpecialistRepository } from '../repositories/specialist.repository.interface';
import { WalletTransactionService } from './wallet-transaction.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { AdminNotificationService } from './admin-notification.service';

@Injectable()
export class WithdrawalRequestService {
  private readonly logger = new Logger(WithdrawalRequestService.name);

  constructor(
    @Inject('IWithdrawalRequestRepository')
    private readonly withdrawalRequestRepository: IWithdrawalRequestRepository,
    private readonly walletService: WalletService,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
    private readonly walletTransactionService: WalletTransactionService,
    @Inject('IUserRepository') // To notify user if ownerType is USER
    private readonly userRepository: IUserRepository,
    @Inject('IVendorRepository') // To get vendor info for notification
    private readonly vendorRepository: IVendorRepository,
    @Inject('ISpecialistRepository') // To get specialist info for notification
    private readonly specialistRepository: ISpecialistRepository,
    private readonly mailService: MailService,
    private readonly adminNotificationService: AdminNotificationService,
  ) {}

  async requestWithdrawal(params: CreateWithdrawalRequestParams): Promise<WithdrawalRequestEntity> {
    const { walletId, amount, requestedById, requestedByType } = params;

    const wallet = await this.walletService.getWalletById(walletId);
    if (wallet.ownerId !== requestedById || wallet.ownerType !== requestedByType) {
      throw new ForbiddenException('Withdrawal request can only be made by the wallet owner.');
    }
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance for withdrawal request.');
    }
    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be positive.');
    }

    const withdrawalRequest = await this.withdrawalRequestRepository.create(
      walletId,
      amount,
      requestedById,
      requestedByType,
    );

    // Notify Finance Admins and Super Admins about the new withdrawal request
    await this.notifyAdminsOfNewWithdrawalRequest(withdrawalRequest);

    // Email Notification to Requester (Initiation)
    let email = '';
    switch (requestedByType) {
      case WalletOwnerType.VENDOR:
        const vendor = await this.vendorRepository.findById(requestedById);
        if (vendor) email = vendor.email;
        break;
      case WalletOwnerType.SPECIALIST:
        const specialist = await this.specialistRepository.findById(requestedById);
        if (specialist) email = specialist.email;
        break;
      case WalletOwnerType.USER:
        const user = await this.userRepository.findById(requestedById);
        if (user) email = user.email;
        break;
    }

    if (email) {
      await this.mailService.sendWithdrawalStatusEmail(email, amount, 'INITIATED');
    }

    this.logger.log(`Withdrawal request ${withdrawalRequest.id} created for wallet ${walletId}`);
    return withdrawalRequest;
  }

  async getWithdrawalRequestById(id: string): Promise<WithdrawalRequestEntity> {
    const request = await this.withdrawalRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundException(`Withdrawal Request with ID ${id} not found.`);
    }
    return request;
  }

  async getWithdrawalRequestsByWalletId(walletId: string): Promise<WithdrawalRequestEntity[]> {
    return this.withdrawalRequestRepository.findByWalletId(walletId);
  }

  async getPendingWithdrawalRequests(): Promise<WithdrawalRequestEntity[]> {
    return this.withdrawalRequestRepository.findByStatus(WithdrawalStatus.PENDING);
  }

  async approveWithdrawal(requestId: string, adminId: string, adminNotes?: string): Promise<WithdrawalRequestEntity> {
    const request = await this.getWithdrawalRequestById(requestId);

    if (request.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException(`Withdrawal request ${requestId} is not in PENDING status.`);
    }

    // Get Organization Wallet
    // Assuming there's a predefined ID or way to identify the Organization's wallet owner ID
    // For now, let's assume the Super Admin's ID is the ownerId for the Organization's wallet.
    const organizationWalletOwner = await this.adminService.findByRole(AdminType.SUPER_ADMIN); // Or a specific Org ID
    if (!organizationWalletOwner || organizationWalletOwner.length === 0) {
      throw new InternalServerErrorException('Organization Wallet owner not found.');
    }
    // We need a single, consistent ownerId for the Organization wallet. Let's pick the first super admin.
    const organizationOwnerId = organizationWalletOwner[0].id;
    const organizationWallet = await this.walletService.getWalletByOwner(organizationOwnerId, WalletOwnerType.ORGANIZATION);


    if (organizationWallet.balance < request.amount) {
      throw new BadRequestException('Insufficient funds in Organization Wallet to cover withdrawal.');
    }

    // Debit the requester's wallet
    await this.walletService.debitWallet(request.walletId, request.amount);
    await this.walletTransactionService.createWalletTransaction({
      walletId: request.walletId,
      type: WalletTransactionType.DEBIT,
      amount: request.amount,
      description: `Withdrawal approved by admin ${adminId}`,
      relatedEntityId: request.id,
      relatedEntityType: WalletRelatedEntityType.WITHDRAWAL,
    });


    const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
      status: WithdrawalStatus.APPROVED,
      approvedById: adminId,
      approvedAt: new Date(),
      adminNotes,
    });

    await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
    this.logger.log(`Withdrawal request ${requestId} approved and funds debited.`);
    return updatedRequest;
  }

  async markWithdrawalAsPaid(requestId: string, adminId: string, adminNotes?: string): Promise<WithdrawalRequestEntity> {
    const request = await this.getWithdrawalRequestById(requestId);

    if (request.status !== WithdrawalStatus.APPROVED) {
      throw new BadRequestException(`Withdrawal request ${requestId} is not in APPROVED status.`);
    }

    const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
      status: WithdrawalStatus.PAID,
      paidAt: new Date(),
      adminNotes: adminNotes ? `${request.adminNotes || ''}
Paid: ${adminNotes}` : request.adminNotes,
    });

    await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
    
    
    // 📧 Notify Finance Admins
    // 🛡️ RE-ENFORCED: Email notification to admins is now disabled per user request. 
    await this.adminNotificationService.notify(
      'FINANCE',
      'Withdrawal Marked as Paid',
      `<p>Withdrawal request #${requestId} for ₦${request.amount} has been marked as PAID.</p>
       <p>Paid by Admin: ${adminId}</p>`,
       false // sendEmail = false
    );

    const financeAdmins = await this.adminService.findByRole(AdminType.FINANCE_ADMIN);
    for (const admin of financeAdmins) {
      const title = 'Payment Marked as Paid';
      const message = `Withdrawal request #${requestId} for ${request.amount} has been marked as PAID by admin ${adminId}.`;
      await this.notificationService.createNotification({
        adminId: admin.id,
        title,
        message,
      });
    }

    this.logger.log(`Withdrawal request ${requestId} marked as PAID.`);
    return updatedRequest;
  }

  async rejectWithdrawal(requestId: string, adminId: string, reason: string): Promise<WithdrawalRequestEntity> {
    const request = await this.getWithdrawalRequestById(requestId);

    if (request.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException(`Withdrawal request ${requestId} is not in PENDING status.`);
    }

    const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
      status: WithdrawalStatus.REJECTED,
      approvedById: adminId,
      approvedAt: new Date(),
      adminNotes: reason,
    });

    await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
    this.logger.log(`Withdrawal request ${requestId} rejected.`);
    return updatedRequest;
  }

  private async notifyAdminsOfNewWithdrawalRequest(request: WithdrawalRequestEntity): Promise<void> {
    const financeAdmins = await this.adminService.findByRole(AdminType.FINANCE_ADMIN);
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    const adminsToNotify = [...financeAdmins, ...superAdmins];

    let requesterName = 'Unknown';
    switch (request.requestedByType) {
        case WalletOwnerType.VENDOR:
            const vendor = await this.vendorRepository.findById(request.requestedById);
            requesterName = vendor ? `${vendor.companyName} (Vendor)` : `Vendor ID ${request.requestedById}`;
            break;
        case WalletOwnerType.SPECIALIST:
            const specialist = await this.specialistRepository.findById(request.requestedById);
            requesterName = specialist ? `Dr. ${specialist.firstName} ${specialist.lastName} (Specialist)` : `Specialist ID ${request.requestedById}`;
            break;
        case WalletOwnerType.USER: // Though users might not withdraw in this specific scenario, good to have
            const user = await this.userRepository.findById(request.requestedById);
            requesterName = user ? `${user.firstName} ${user.lastName} (User)` : `User ID ${request.requestedById}`;
            break;
    }


    for (const admin of adminsToNotify) {
      const title = 'New Withdrawal Request';
      const message = `${requesterName} has requested a withdrawal of ${request.amount} from their wallet. Request ID: ${request.id}.`;
      await this.notificationService.createNotification({
        adminId: admin.id,
        title,
        message,
      });
    }

    // 📧 Notify Relevant Admins via Email
    // 🛡️ RE-ENFORCED: Email notification to admins is now disabled per user request to reduce noise. 
    await this.adminNotificationService.notify(
      'FINANCE',
      'New Withdrawal Request',
      `<p>A new withdrawal request has been submitted.</p>
       <p><strong>Requester:</strong> ${requesterName}</p>
       <p><strong>Amount:</strong> ₦${request.amount}</p>
       <p><strong>Request ID:</strong> ${request.id}</p>`,
       false // sendEmail = false
    );
  }

  private async notifyRequesterOfWithdrawalStatus(request: WithdrawalRequestEntity): Promise<void> {
    const title = `Withdrawal Request ${request.status}`;
    let message = `Your withdrawal request #${request.id} for ${request.amount} has been ${request.status.toLowerCase()}.`;

    if (request.status === WithdrawalStatus.REJECTED && request.adminNotes) {
      message += ` Reason: ${request.adminNotes}`;
    } else if (request.status === WithdrawalStatus.PAID) {
      message += ` Funds should be in your account shortly.`;
    }

    let email = '';
    let name = '';

    switch (request.requestedByType) {
        case WalletOwnerType.VENDOR:
            const vendor = await this.vendorRepository.findById(request.requestedById);
            if (vendor) {
              email = vendor.email;
              name = vendor.companyName;
            }
            await this.notificationService.createNotification({ vendorId: request.requestedById, title, message });
            break;
        case WalletOwnerType.SPECIALIST:
            const specialist = await this.specialistRepository.findById(request.requestedById);
            if (specialist) {
              email = specialist.email;
              name = `${specialist.firstName} ${specialist.lastName}`;
            }
            await this.notificationService.createNotification({ specialistId: request.requestedById, title, message });
            break;
        case WalletOwnerType.USER:
            const user = await this.userRepository.findById(request.requestedById);
            if (user) {
              email = user.email;
              name = `${user.firstName} ${user.lastName}`;
            }
            await this.notificationService.createNotification({ userId: request.requestedById, title, message });
            break;
    }

    if (email) {
      await this.mailService.sendWithdrawalStatusEmail(email, request.amount, request.status, request.adminNotes || undefined);
    }
  }
}
