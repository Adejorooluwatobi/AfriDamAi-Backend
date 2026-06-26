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
var WithdrawalRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequestService = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const notification_service_1 = require("./notification.service");
const admin_service_1 = require("./admin.service");
const client_1 = require("@prisma/client");
const wallet_transaction_service_1 = require("./wallet-transaction.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
const admin_notification_service_1 = require("./admin-notification.service");
let WithdrawalRequestService = WithdrawalRequestService_1 = class WithdrawalRequestService {
    constructor(withdrawalRequestRepository, walletService, notificationService, adminService, walletTransactionService, userRepository, vendorRepository, specialistRepository, mailService, adminNotificationService) {
        this.withdrawalRequestRepository = withdrawalRequestRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
        this.adminService = adminService;
        this.walletTransactionService = walletTransactionService;
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.specialistRepository = specialistRepository;
        this.mailService = mailService;
        this.adminNotificationService = adminNotificationService;
        this.logger = new common_1.Logger(WithdrawalRequestService_1.name);
    }
    async requestWithdrawal(params) {
        const { walletId, amount, requestedById, requestedByType } = params;
        const wallet = await this.walletService.getWalletById(walletId);
        if (wallet.ownerId !== requestedById || wallet.ownerType !== requestedByType) {
            throw new common_1.ForbiddenException('Withdrawal request can only be made by the wallet owner.');
        }
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance for withdrawal request.');
        }
        if (amount <= 0) {
            throw new common_1.BadRequestException('Withdrawal amount must be positive.');
        }
        const withdrawalRequest = await this.withdrawalRequestRepository.create(walletId, amount, requestedById, requestedByType);
        await this.notifyAdminsOfNewWithdrawalRequest(withdrawalRequest);
        let email = '';
        switch (requestedByType) {
            case client_1.WalletOwnerType.VENDOR:
                const vendor = await this.vendorRepository.findById(requestedById);
                if (vendor)
                    email = vendor.email;
                break;
            case client_1.WalletOwnerType.SPECIALIST:
                const specialist = await this.specialistRepository.findById(requestedById);
                if (specialist)
                    email = specialist.email;
                break;
            case client_1.WalletOwnerType.USER:
                const user = await this.userRepository.findById(requestedById);
                if (user)
                    email = user.email;
                break;
        }
        if (email) {
            await this.mailService.sendWithdrawalStatusEmail(email, amount, 'INITIATED');
        }
        this.logger.log(`Withdrawal request ${withdrawalRequest.id} created for wallet ${walletId}`);
        return withdrawalRequest;
    }
    async getWithdrawalRequestById(id) {
        const request = await this.withdrawalRequestRepository.findById(id);
        if (!request) {
            throw new common_1.NotFoundException(`Withdrawal Request with ID ${id} not found.`);
        }
        return request;
    }
    async getWithdrawalRequestsByWalletId(walletId) {
        return this.withdrawalRequestRepository.findByWalletId(walletId);
    }
    async getPendingWithdrawalRequests() {
        return this.withdrawalRequestRepository.findByStatus(client_1.WithdrawalStatus.PENDING);
    }
    async approveWithdrawal(requestId, adminId, adminNotes) {
        const request = await this.getWithdrawalRequestById(requestId);
        if (request.status !== client_1.WithdrawalStatus.PENDING) {
            throw new common_1.BadRequestException(`Withdrawal request ${requestId} is not in PENDING status.`);
        }
        const organizationWalletOwner = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        if (!organizationWalletOwner || organizationWalletOwner.length === 0) {
            throw new common_1.InternalServerErrorException('Organization Wallet owner not found.');
        }
        const organizationOwnerId = organizationWalletOwner[0].id;
        const organizationWallet = await this.walletService.getWalletByOwner(organizationOwnerId, client_1.WalletOwnerType.ORGANIZATION);
        if (organizationWallet.balance < request.amount) {
            throw new common_1.BadRequestException('Insufficient funds in Organization Wallet to cover withdrawal.');
        }
        await this.walletService.debitWallet(request.walletId, request.amount);
        await this.walletTransactionService.createWalletTransaction({
            walletId: request.walletId,
            type: client_1.WalletTransactionType.DEBIT,
            amount: request.amount,
            description: `Withdrawal approved by admin ${adminId}`,
            relatedEntityId: request.id,
            relatedEntityType: client_1.WalletRelatedEntityType.WITHDRAWAL,
        });
        const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
            status: client_1.WithdrawalStatus.APPROVED,
            approvedById: adminId,
            approvedAt: new Date(),
            adminNotes,
        });
        await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
        this.logger.log(`Withdrawal request ${requestId} approved and funds debited.`);
        return updatedRequest;
    }
    async markWithdrawalAsPaid(requestId, adminId, adminNotes) {
        const request = await this.getWithdrawalRequestById(requestId);
        if (request.status !== client_1.WithdrawalStatus.APPROVED) {
            throw new common_1.BadRequestException(`Withdrawal request ${requestId} is not in APPROVED status.`);
        }
        const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
            status: client_1.WithdrawalStatus.PAID,
            paidAt: new Date(),
            adminNotes: adminNotes ? `${request.adminNotes || ''}
Paid: ${adminNotes}` : request.adminNotes,
        });
        await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
        await this.adminNotificationService.notify('FINANCE', 'Withdrawal Marked as Paid', `<p>Withdrawal request #${requestId} for ₦${request.amount} has been marked as PAID.</p>
       <p>Paid by Admin: ${adminId}</p>`, false);
        const financeAdmins = await this.adminService.findByRole(client_1.AdminType.FINANCE_ADMIN);
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
    async rejectWithdrawal(requestId, adminId, reason) {
        const request = await this.getWithdrawalRequestById(requestId);
        if (request.status !== client_1.WithdrawalStatus.PENDING) {
            throw new common_1.BadRequestException(`Withdrawal request ${requestId} is not in PENDING status.`);
        }
        const updatedRequest = await this.withdrawalRequestRepository.update(requestId, {
            status: client_1.WithdrawalStatus.REJECTED,
            approvedById: adminId,
            approvedAt: new Date(),
            adminNotes: reason,
        });
        await this.notifyRequesterOfWithdrawalStatus(updatedRequest);
        this.logger.log(`Withdrawal request ${requestId} rejected.`);
        return updatedRequest;
    }
    async notifyAdminsOfNewWithdrawalRequest(request) {
        const financeAdmins = await this.adminService.findByRole(client_1.AdminType.FINANCE_ADMIN);
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        const adminsToNotify = [...financeAdmins, ...superAdmins];
        let requesterName = 'Unknown';
        switch (request.requestedByType) {
            case client_1.WalletOwnerType.VENDOR:
                const vendor = await this.vendorRepository.findById(request.requestedById);
                requesterName = vendor ? `${vendor.companyName} (Vendor)` : `Vendor ID ${request.requestedById}`;
                break;
            case client_1.WalletOwnerType.SPECIALIST:
                const specialist = await this.specialistRepository.findById(request.requestedById);
                requesterName = specialist ? `Dr. ${specialist.firstName} ${specialist.lastName} (Specialist)` : `Specialist ID ${request.requestedById}`;
                break;
            case client_1.WalletOwnerType.USER:
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
        await this.adminNotificationService.notify('FINANCE', 'New Withdrawal Request', `<p>A new withdrawal request has been submitted.</p>
       <p><strong>Requester:</strong> ${requesterName}</p>
       <p><strong>Amount:</strong> ₦${request.amount}</p>
       <p><strong>Request ID:</strong> ${request.id}</p>`, false);
    }
    async notifyRequesterOfWithdrawalStatus(request) {
        const title = `Withdrawal Request ${request.status}`;
        let message = `Your withdrawal request #${request.id} for ${request.amount} has been ${request.status.toLowerCase()}.`;
        if (request.status === client_1.WithdrawalStatus.REJECTED && request.adminNotes) {
            message += ` Reason: ${request.adminNotes}`;
        }
        else if (request.status === client_1.WithdrawalStatus.PAID) {
            message += ` Funds should be in your account shortly.`;
        }
        let email = '';
        let name = '';
        switch (request.requestedByType) {
            case client_1.WalletOwnerType.VENDOR:
                const vendor = await this.vendorRepository.findById(request.requestedById);
                if (vendor) {
                    email = vendor.email;
                    name = vendor.companyName;
                }
                await this.notificationService.createNotification({ vendorId: request.requestedById, title, message });
                break;
            case client_1.WalletOwnerType.SPECIALIST:
                const specialist = await this.specialistRepository.findById(request.requestedById);
                if (specialist) {
                    email = specialist.email;
                    name = `${specialist.firstName} ${specialist.lastName}`;
                }
                await this.notificationService.createNotification({ specialistId: request.requestedById, title, message });
                break;
            case client_1.WalletOwnerType.USER:
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
};
exports.WithdrawalRequestService = WithdrawalRequestService;
exports.WithdrawalRequestService = WithdrawalRequestService = WithdrawalRequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IWithdrawalRequestRepository')),
    __param(5, (0, common_1.Inject)('IUserRepository')),
    __param(6, (0, common_1.Inject)('IVendorRepository')),
    __param(7, (0, common_1.Inject)('ISpecialistRepository')),
    __metadata("design:paramtypes", [Object, wallet_service_1.WalletService,
        notification_service_1.NotificationService,
        admin_service_1.AdminService,
        wallet_transaction_service_1.WalletTransactionService, Object, Object, Object, mail_service_1.MailService,
        admin_notification_service_1.AdminNotificationService])
], WithdrawalRequestService);
//# sourceMappingURL=withdrawal-request.service.js.map