import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { WalletService } from './wallet.service';
import { AdminType } from '../entities/admin.entity';
import { WalletOwnerType } from '@prisma/client';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly walletService: WalletService,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Database Seeding logic triggered in background...');
    // Non-blocking call to ensure application starts listening on port immediately
    this.seedOrganizationAdminAndWallet()
      .then(() => this.logger.log('✅ Seeding Sequence Finished.'))
      .catch((err) => this.logger.error(`🚨 Fatal Seeding Error: ${err.message}`, err.stack));
  }

  private async seedOrganizationAdminAndWallet() {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@afridamai.com';
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'AfriDam2026!';

    this.logger.log(`Checking for existing Super Admin (Role: ${AdminType.SUPER_ADMIN})...`);
    
    // 1. Ensure Super Admin exists
    let superAdmin: any;
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    this.logger.log(`Found ${superAdmins.length} Super Admin(s) in database.`);

    if (superAdmins.length === 0) {
      this.logger.log(`No Super Admin found. Attempting to create default: ${defaultEmail}`);
      
      // Safety check: Does an admin with this email exist but with a different role?
      const existingByEmail = await this.adminService.findByEmail(defaultEmail);
      if (existingByEmail) {
        this.logger.warn(`Admin with email ${defaultEmail} already exists but is NOT a Super Admin (Current Role: ${existingByEmail.type}).`);
        this.logger.warn(`Skipping seeding of default Super Admin to avoid conflict.`);
        return; // Stop here to prevent crash
      }

      try {
        superAdmin = await this.adminService.createAdmin({
          email: defaultEmail,
          password: defaultPass,
          firstName: 'System',
          lastName: 'Admin',
          type: AdminType.SUPER_ADMIN,
          isActive: true,
        });
        this.logger.log(`🏆 Default Super Admin created successfully (ID: ${superAdmin.id})`);
      } catch (createError) {
        this.logger.error(`❌ Failed to create default Super Admin: ${createError.message}`);
        return;
      }
    } else {
      superAdmin = superAdmins[0];
      this.logger.log(`Super Admin already exists: ${superAdmin.email}. Ensuring active status...`);
      // 🛡️ RE-ENFORCED: Super Admin must always be active and unsuspended
      await this.adminService.updateAdmin(superAdmin.id, { 
        isActive: true, 
        isSuspended: false 
      });
    }

    if (!superAdmin) return;

    // 2. Ensure Organization Wallet exists for this Super Admin
    this.logger.log(`Verifying Organization Wallet for Admin: ${superAdmin.email}`);
    let mainOrganizationWallet: any;
    try {
      mainOrganizationWallet = await this.walletService.getWalletByOwner(superAdmin.id, WalletOwnerType.ORGANIZATION);
      this.logger.log(`Organization Wallet verified (ID: ${mainOrganizationWallet.id})`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.log('Creating default Organization Wallet...');
        try {
          mainOrganizationWallet = await this.walletService.createWallet({
            ownerId: superAdmin.id,
            ownerType: WalletOwnerType.ORGANIZATION,
            initialBalance: 0,
          });
          this.logger.log(`Default Organization Wallet created with ID: ${mainOrganizationWallet.id}`);
        } catch (walletError) {
          this.logger.error(`❌ Failed to create Organization Wallet: ${walletError.message}`);
        }
      } else {
        this.logger.error(`❌ Error checking Organization Wallet: ${error.message}`);
      }
    }

    if (!mainOrganizationWallet) return;

    // 3. Cleanup rogue organization wallets
    this.logger.log('Checking for rogue Organization wallets...');
    try {
      const allOrganizationWallets = await this.walletService.findAllWalletsByOwnerType(WalletOwnerType.ORGANIZATION);
      const otherWallets = allOrganizationWallets.filter(w => w.id !== mainOrganizationWallet.id);

      if (otherWallets.length > 0) {
        this.logger.warn(`Found ${otherWallets.length} duplicate Organization wallets. Sanitizing...`);
        for (const wallet of otherWallets) {
          try {
            await this.walletService.deleteWallet(wallet.id);
            this.logger.log(`🗑️ Deleted rogue Organization Wallet: ${wallet.id}`);
          } catch (deleteError) {
            this.logger.error(`Failed to delete rogue wallet ${wallet.id}: ${deleteError.message}`);
          }
        }
      } else {
        this.logger.log('No rogue Organization wallets found.');
      }
    } catch (cleanupError) {
      this.logger.error(`❌ Cleanup check failed: ${cleanupError.message}`);
    }
  }
}
