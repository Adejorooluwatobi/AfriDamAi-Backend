import { VendorEntity } from '../entities/vendor.entity';
import { CreateVendorParams } from 'src/utils/type';
import type { IVendorRepository } from '../repositories/vendor.repository.interface';
import { WalletService } from './wallet.service';
import { Wallet } from '../entities/wallet.entity';
import { VendorStatus } from '@prisma/client';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
export declare class VendorService {
    private readonly vendorRepository;
    private readonly walletService;
    private readonly mailService;
    constructor(vendorRepository: IVendorRepository, walletService: WalletService, mailService: MailService);
    createVendor(vendorDetails: CreateVendorParams): Promise<VendorEntity>;
    findAllVendor(): Promise<VendorEntity[]>;
    findOneVendor(id: string): Promise<{
        vendor: VendorEntity;
        wallet: Wallet | null;
    } | null>;
    updateVendor(id: string, updateVendorDetails: Partial<VendorEntity>): Promise<VendorEntity>;
    deleteVendor(id: string): Promise<void>;
    updateVendorActiveStatus(id: string, isActive: boolean): Promise<VendorEntity>;
    updateVendorSuspensionStatus(id: string, isSuspended: boolean): Promise<VendorEntity>;
    updateVendorApprovalStatus(id: string, status: VendorStatus): Promise<VendorEntity>;
    findByEmail(email: string): Promise<VendorEntity | null>;
}
