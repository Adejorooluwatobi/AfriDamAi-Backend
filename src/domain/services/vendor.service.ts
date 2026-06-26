import { ConflictException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { VendorEntity } from '../entities/vendor.entity';
import { CreateVendorParams } from 'src/utils/type';
import type { IVendorRepository } from '../repositories/vendor.repository.interface';
import { WalletService } from './wallet.service'; // Import WalletService
import { Wallet } from '../entities/wallet.entity'; // Import Wallet
import { WalletOwnerType, VendorStatus } from '@prisma/client'; // Import WalletOwnerType
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class VendorService {
  constructor(
    @Inject('IVendorRepository') private readonly vendorRepository: IVendorRepository,
    private readonly walletService: WalletService, // Inject WalletService
    private readonly mailService: MailService,
  ) {}

  async createVendor(vendorDetails: CreateVendorParams): Promise<VendorEntity> {
    if (!vendorDetails.email || !vendorDetails.password) {
      throw new NotFoundException('Email and password are required');
    }
    const existingVendor = await this.vendorRepository.findByEmail(vendorDetails.email);
    if (existingVendor) {
      throw new ConflictException(`Vendor with email ${vendorDetails.email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(vendorDetails.password, 10);
    const newVendor = await this.vendorRepository.create({
      ...vendorDetails,
      password: hashedPassword,
      isActive: true,
    });
    console.log('Vendor created successfully:', newVendor.id);

    // Create a wallet for the new vendor
    await this.walletService.createWallet({
        ownerId: newVendor.id,
        ownerType: WalletOwnerType.VENDOR,
        initialBalance: 0,
    });
    console.log(`Wallet created for vendor: ${newVendor.id}`);

    return newVendor;
  }

  async findAllVendor(): Promise<VendorEntity[]> {
    const vendors = await this.vendorRepository.findAll();
    return vendors;
  }

  async findOneVendor(id: string): Promise<{ vendor: VendorEntity; wallet: Wallet | null } | null> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      return null;
    }
    
    let wallet: Wallet | null = null;
    try {
      wallet = await this.walletService.getWalletByOwner(id, WalletOwnerType.VENDOR);
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log(`Wallet not found for vendor ${id}, creating one...`);
        wallet = await this.walletService.createWallet({
          ownerId: id,
          ownerType: WalletOwnerType.VENDOR,
          initialBalance: 0,
        });
      } else {
        throw error;
      }
    }
    
    return { vendor, wallet };
  }

  async updateVendor(id: string, updateVendorDetails: Partial<VendorEntity>): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }

    if (updateVendorDetails.password) {
      updateVendorDetails.password = await bcrypt.hash(updateVendorDetails.password, 10);
    }
    
    const finalUpdate = {
      ...vendor,
      ...updateVendorDetails,
    };

    const updatedVendor = await this.vendorRepository.update(id, finalUpdate);
    console.log('Vendor updated successfully:', updatedVendor.id);
    return updatedVendor;
  }

  async deleteVendor(id: string): Promise<void> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    await this.vendorRepository.delete(id);
    console.log('Vendor deleted successfully:', vendor.id);
  }

  async updateVendorActiveStatus(id: string, isActive: boolean): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) throw new NotFoundException(`Vendor with id ${id} not found`);
    const updatedVendor = await this.vendorRepository.update(id, { isActive });
    console.log(`Vendor active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
    
    // 📧 Notify Vendor
    await this.mailService.sendAccountStatusEmail(
        vendor.email,
        vendor.companyName || 'Vendor',
        isActive ? 'ACTIVATED' : 'DEACTIVATED',
        'VENDOR'
    );

    return updatedVendor;
  }

  async updateVendorSuspensionStatus(id: string, isSuspended: boolean): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) throw new NotFoundException(`Vendor with id ${id} not found`);
    const updatedVendor = await this.vendorRepository.update(id, { isSuspended });
    console.log(`Vendor suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'active'}`);

    // 📧 Notify Vendor
    await this.mailService.sendAccountStatusEmail(
        vendor.email,
        vendor.companyName || 'Vendor',
        isSuspended ? 'SUSPENDED' : 'UNSUSPENDED',
        'VENDOR'
    );

    return updatedVendor;
  }

  async updateVendorApprovalStatus(id: string, status: VendorStatus): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) throw new NotFoundException(`Vendor with id ${id} not found`);

    const updatedVendor = await this.vendorRepository.update(id, { status });
    console.log(`Vendor approval status updated: ${id} to ${status}`);
    return updatedVendor;
  }

  async findByEmail(email: string): Promise<VendorEntity | null> {
    const vendor = await this.vendorRepository.findByEmail(email);
    return vendor;
  }
}